import { prisma } from '@/lib/prisma'
import { fetchEsimGoCatalog, EsimGoBundle } from '@/lib/providers/esim-go'

export interface SyncOptions {
  limit?: number
  countries?: string
  marginPercentage?: number // Default 25% (0.25)
  minimumMarkupUSD?: number // Default $2.00
  batchSize?: number // Default 50 items per parallel chunk
}

export interface SyncResult {
  success: boolean
  supplier: string
  totalFetched: number
  processed: number
  packagesCreated: number
  packagesUpdated: number
  destinationsSynced: number
  errors: Array<{ bundle: string; error: string }>
  durationMs: number
}

/**
 * Calculates the retail price from wholesale price with margin and minimum markup rules
 */
export function calculateRetailPrice(
  wholesalePrice: number,
  marginPercentage = 0.25,
  minimumMarkupUSD = 2.0
): number {
  if (wholesalePrice <= 0) return 0

  const percentagePrice = wholesalePrice * (1 + marginPercentage)
  const minimumMarkupPrice = wholesalePrice + minimumMarkupUSD
  const computedPrice = Math.max(percentagePrice, minimumMarkupPrice)

  return Math.round(computedPrice * 100) / 100
}

/**
 * Helper to split an array into chunks of specified size
 */
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Synchronizes and normalizes the eSIM Go catalog into Supabase via Prisma
 * High-performance batched pipeline with parallel destination and package upserts.
 */
export async function syncEsimGoCatalog(options: SyncOptions = {}): Promise<SyncResult> {
  const startTime = Date.now()
  const errors: Array<{ bundle: string; error: string }> = []
  let packagesCreated = 0
  let packagesUpdated = 0
  let destinationsSynced = 0
  let processed = 0

  const marginPercentage = options.marginPercentage ?? 0.25
  const minimumMarkupUSD = options.minimumMarkupUSD ?? 2.0
  const batchSize = options.batchSize ?? 50

  try {
    // 1. Ensure the Supplier "eSIM Go" exists
    const supplier = await prisma.supplier.upsert({
      where: { name: 'eSIM Go' },
      update: {
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        name: 'eSIM Go',
        isActive: true,
        apiConfig: {
          baseUrl: 'https://api.esim-go.com/v2.2',
          providerType: 'direct_api',
        },
      },
    })

    // 2. Fetch raw catalog from eSIM Go API (paginated)
    console.log('[eSIM Go Sync] Fetching catalog from API...')
    const catalogResponse = await fetchEsimGoCatalog(
      options.countries ? { countries: options.countries, perPage: 500 } : { perPage: 500 }
    )

    if (!catalogResponse || !catalogResponse.bundles || catalogResponse.bundles.length === 0) {
      throw new Error('No bundles returned from eSIM Go catalog API')
    }

    const rawBundles = options.limit
      ? catalogResponse.bundles.slice(0, options.limit)
      : catalogResponse.bundles

    console.log(`[eSIM Go Sync] Total bundles retrieved: ${rawBundles.length}`)

    // 3. Pre-extract all unique destinations across all bundles
    const uniqueDestMap = new Map<
      string,
      { name: string; type: string; flagUrl: string | null; bannerUrl: string | null }
    >()

    for (const rawBundle of rawBundles) {
      const bundle = rawBundle as EsimGoBundle & {
        countries?: Array<{ name?: string; region?: string; iso?: string }>
        imageUrl?: string
      }

      const primaryCountry = bundle.countries?.[0]
      let isoCode = primaryCountry?.iso?.trim().toUpperCase()

      if (!isoCode) {
        const parts = bundle.name.split('_')
        if (parts.length >= 4 && parts[3]?.length >= 2 && parts[3]?.length <= 3) {
          isoCode = parts[3].toUpperCase()
        } else {
          isoCode = 'GLOBAL'
        }
      }

      if (!uniqueDestMap.has(isoCode)) {
        const countryName = primaryCountry?.name || isoCode
        const isRegionOrGlobal =
          (bundle.countries && bundle.countries.length > 1) ||
          isoCode === 'GLOBAL' ||
          isoCode === 'EU'

        const destinationType = isRegionOrGlobal
          ? isoCode === 'GLOBAL'
            ? 'global'
            : 'region'
          : 'country'

        const flagUrl =
          isoCode !== 'GLOBAL' && isoCode !== 'EU'
            ? `https://hatscripts.github.io/circle-flags/flags/${isoCode.toLowerCase()}.svg`
            : bundle.imageUrl || null

        const bannerUrl = bundle.imageUrl || null

        uniqueDestMap.set(isoCode, {
          name: countryName,
          type: destinationType,
          flagUrl,
          bannerUrl,
        })
      }
    }

    // 4. Batch sync all unique destinations using Promise.all in chunks
    const existingDestinations = await prisma.destination.findMany()
    const destinationIdMap = new Map<string, string>()

    for (const d of existingDestinations) {
      destinationIdMap.set(d.isoCode.toUpperCase(), d.id)
    }

    const uniqueDestsArray = Array.from(uniqueDestMap.entries())
    const destChunks = chunkArray(uniqueDestsArray, batchSize)
    console.log(`[eSIM Go Sync] Syncing ${uniqueDestMap.size} unique destinations in ${destChunks.length} chunks...`)

    for (const destChunk of destChunks) {
      await Promise.all(
        destChunk.map(async ([isoCode, destInfo]) => {
          const existing = existingDestinations.find((d) => d.isoCode.toUpperCase() === isoCode)
          const existingProviders = existing?.supportedProviders || []
          const updatedProviders = Array.from(new Set([...existingProviders, 'eSIM Go']))
          const bannerUrl = destInfo.bannerUrl || existing?.bannerUrl || null

          const slug =
            destInfo.name
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '') || isoCode.toLowerCase()

          const destination = await prisma.destination.upsert({
            where: { isoCode },
            update: {
              name: destInfo.name,
              slug,
              type: destInfo.type,
              flagUrl: destInfo.flagUrl || undefined,
              bannerUrl: bannerUrl || undefined,
              supportedProviders: updatedProviders,
            },
            create: {
              isoCode,
              name: destInfo.name,
              slug,
              type: destInfo.type,
              flagUrl: destInfo.flagUrl,
              bannerUrl,
              supportedProviders: ['eSIM Go'],
            },
          })

          destinationIdMap.set(isoCode, destination.id)
          destinationsSynced++
        })
      )
    }

    // 5. Pre-load existing package IDs for eSIM Go
    const existingPackageIds = new Set(
      (
        await prisma.unifiedPackage.findMany({
          where: { supplierId: supplier.id },
          select: { supplierPackageId: true },
        })
      ).map((p) => p.supplierPackageId)
    )

    // 6. Split raw bundles into chunks for batch processing
    const bundleChunks = chunkArray(rawBundles, batchSize)
    console.log(`[eSIM Go Sync] Processing ${rawBundles.length} packages in ${bundleChunks.length} chunks...`)

    for (let chunkIdx = 0; chunkIdx < bundleChunks.length; chunkIdx++) {
      const chunk = bundleChunks[chunkIdx]

      await Promise.all(
        chunk.map(async (rawBundle) => {
          const bundle = rawBundle as EsimGoBundle & {
            countries?: Array<{ name?: string; region?: string; iso?: string }>
            imageUrl?: string
          }

          try {
            const primaryCountry = bundle.countries?.[0]
            let isoCode = primaryCountry?.iso?.trim().toUpperCase()

            if (!isoCode) {
              const parts = bundle.name.split('_')
              if (parts.length >= 4 && parts[3]?.length >= 2 && parts[3]?.length <= 3) {
                isoCode = parts[3].toUpperCase()
              } else {
                isoCode = 'GLOBAL'
              }
            }

            const countryName = primaryCountry?.name || isoCode
            const destinationId = destinationIdMap.get(isoCode) || destinationIdMap.get('GLOBAL')!

            const networkType =
              Array.isArray(bundle.speed) && bundle.speed.length > 0
                ? bundle.speed.join('/')
                : '5G/4G/LTE'

            const wholesaleCostUSD = Number(bundle.price) || 0
            const retailPriceUSD = calculateRetailPrice(
              wholesaleCostUSD,
              marginPercentage,
              minimumMarkupUSD
            )

            const isExisting = existingPackageIds.has(bundle.name)

            await prisma.unifiedPackage.upsert({
              where: {
                supplierId_supplierPackageId: {
                  supplierId: supplier.id,
                  supplierPackageId: bundle.name,
                },
              },
              update: {
                destinationId,
                supplierName: 'eSIM Go',
                destinationName: countryName,
                dataAmountMB: bundle.dataAmount || 1024,
                validityDays: bundle.duration || 30,
                networkType,
                isUnlimited: Boolean(bundle.unlimited),
                isTopUpSupported: true,
                wholesaleCostUSD,
                retailPriceUSD,
                isActive: true,
                updatedAt: new Date(),
              },
              create: {
                supplierId: supplier.id,
                destinationId,
                supplierPackageId: bundle.name,
                supplierName: 'eSIM Go',
                destinationName: countryName,
                dataAmountMB: bundle.dataAmount || 1024,
                validityDays: bundle.duration || 30,
                networkType,
                isUnlimited: Boolean(bundle.unlimited),
                isTopUpSupported: true,
                wholesaleCostUSD,
                retailPriceUSD,
                isActive: true,
              },
            })

            if (isExisting) {
              packagesUpdated++
            } else {
              packagesCreated++
            }
            processed++
          } catch (bundleError) {
            errors.push({
              bundle: bundle.name || 'unknown',
              error: bundleError instanceof Error ? bundleError.message : String(bundleError),
            })
          }
        })
      )

      if ((chunkIdx + 1) % 20 === 0 || chunkIdx === bundleChunks.length - 1) {
        console.log(`[eSIM Go Sync] Progress: ${processed}/${rawBundles.length} packages processed`)
      }
    }

    // 7. Update Supplier with inventory metrics and sync timestamp
    const [uniqueDestinations, totalActivePackages] = await Promise.all([
      prisma.unifiedPackage.findMany({
        where: {
          supplierId: supplier.id,
          isActive: true,
        },
        select: {
          destinationId: true,
        },
        distinct: ['destinationId'],
      }),
      prisma.unifiedPackage.count({
        where: {
          supplierId: supplier.id,
          isActive: true,
        },
      }),
    ])

    await prisma.supplier.update({
      where: { id: supplier.id },
      data: {
        totalDestinations: uniqueDestinations.length,
        totalPackages: totalActivePackages,
        lastSyncAt: new Date(),
      },
    })

    return {
      success: true,
      supplier: 'eSIM Go',
      totalFetched: rawBundles.length,
      processed,
      packagesCreated,
      packagesUpdated,
      destinationsSynced,
      errors,
      durationMs: Date.now() - startTime,
    }
  } catch (error) {
    console.error('[syncEsimGoCatalog] Sync pipeline failed:', error)
    return {
      success: false,
      supplier: 'eSIM Go',
      totalFetched: 0,
      processed,
      packagesCreated,
      packagesUpdated,
      destinationsSynced,
      errors: [
        {
          bundle: 'ROOT_PIPELINE',
          error: error instanceof Error ? error.message : String(error),
        },
      ],
      durationMs: Date.now() - startTime,
    }
  }
}
