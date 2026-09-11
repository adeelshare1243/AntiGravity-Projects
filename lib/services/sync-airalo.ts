import { prisma } from '@/lib/prisma'
import { fetchAiraloCatalog, AiraloCountry, AiraloOperator, AiraloPackage } from '@/lib/providers/airalo'

export interface AiraloSyncOptions {
  limit?: number
  marginPercentage?: number // Default 25% (0.25)
  minimumMarkupUSD?: number // Default $2.00
  packageType?: string // e.g. "local", "global", "regions"
  batchSize?: number // Default 50 items per parallel chunk
}

export interface AiraloSyncResult {
  success: boolean
  supplier: string
  destinationsSynced: number
  totalPackagesFound: number
  processed: number
  packagesCreated: number
  packagesUpdated: number
  errors: Array<{ packageId: string; error: string }>
  durationMs: number
}

/**
 * Calculates retail price from wholesale price with margin and minimum markup rules
 */
export function calculateAiraloRetailPrice(
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

interface FlattenedAiraloPackageItem {
  countryIso: string
  countryTitle: string
  countryImage?: string | null
  pkg: AiraloPackage
  operator?: AiraloOperator
}

/**
 * Synchronizes and normalizes the Airalo catalog into Supabase via Prisma
 * Ultra-fast pipeline with upfront destination sync and batched upserts.
 */
export async function syncAiraloCatalog(
  options: AiraloSyncOptions = {}
): Promise<AiraloSyncResult> {
  const startTime = Date.now()
  const errors: Array<{ packageId: string; error: string }> = []
  let packagesCreated = 0
  let packagesUpdated = 0
  let destinationsSynced = 0
  let processed = 0

  const marginPercentage = options.marginPercentage ?? 0.25
  const minimumMarkupUSD = options.minimumMarkupUSD ?? 2.0
  const batchSize = options.batchSize ?? 50

  try {
    // 1. Ensure the Supplier "Airalo" exists
    const supplier = await prisma.supplier.upsert({
      where: { name: 'Airalo' },
      update: {
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        name: 'Airalo',
        isActive: true,
        apiConfig: {
          baseUrl: 'https://partners-api.airalo.com/v2',
          providerType: 'oauth2_api',
        },
      },
    })

    // 2. Fetch raw catalog from Airalo API (paginated)
    console.log('[Airalo Sync] Fetching paginated catalog from API...')
    const catalogResponse = await fetchAiraloCatalog(
      options.packageType ? { type: options.packageType, limit: 100 } : { limit: 100 }
    )

    if (!catalogResponse || !catalogResponse.data) {
      throw new Error('No data returned from Airalo catalog API')
    }

    const rawData = Array.isArray(catalogResponse.data)
      ? catalogResponse.data
      : [catalogResponse.data]

    console.log(`[Airalo Sync] Total countries/records retrieved: ${rawData.length}`)

    // 3. Pre-extract all unique destinations and flatten all packages
    const uniqueDestMap = new Map<
      string,
      { name: string; type: string; flagUrl: string | null; bannerUrl: string | null }
    >()
    const allPackageItems: FlattenedAiraloPackageItem[] = []

    for (const rawItem of rawData) {
      const country = rawItem as AiraloCountry & {
        operators?: Array<AiraloOperator & { packages?: AiraloPackage[] }>
      }

      const countryIso = (country.country_code || country.slug || 'GLOBAL').trim().toUpperCase()
      const countryTitle = country.title || countryIso
      const countryImage = country.image?.url

      if (!uniqueDestMap.has(countryIso)) {
        const isRegionOrGlobal = countryIso === 'GLOBAL' || countryIso.length > 2 || countryIso === 'EU'
        const destType = isRegionOrGlobal
          ? countryIso === 'GLOBAL'
            ? 'global'
            : 'region'
          : 'country'

        const flagUrl =
          !isRegionOrGlobal && countryIso.length === 2
            ? `https://hatscripts.github.io/circle-flags/flags/${countryIso.toLowerCase()}.svg`
            : countryImage || null

        const bannerUrl = countryImage || null

        uniqueDestMap.set(countryIso, {
          name: countryTitle,
          type: destType,
          flagUrl,
          bannerUrl,
        })
      }

      if (Array.isArray(country.operators)) {
        for (const op of country.operators) {
          if (Array.isArray(op.packages)) {
            for (const pkg of op.packages) {
              allPackageItems.push({
                countryIso,
                countryTitle,
                countryImage,
                pkg,
                operator: op,
              })
            }
          }
        }
      } else if (Array.isArray(country.packages)) {
        for (const pkg of country.packages) {
          allPackageItems.push({
            countryIso,
            countryTitle,
            countryImage,
            pkg,
          })
        }
      }
    }

    // 4. Synchronize all unique Destination records upfront
    const existingDestinations = await prisma.destination.findMany()
    const destinationIdMap = new Map<string, string>()

    for (const d of existingDestinations) {
      destinationIdMap.set(d.isoCode.toUpperCase(), d.id)
    }

    const uniqueDestsArray = Array.from(uniqueDestMap.entries())
    const destChunks = chunkArray(uniqueDestsArray, batchSize)
    console.log(`[Airalo Sync] Syncing ${uniqueDestMap.size} unique destinations in ${destChunks.length} chunks...`)

    for (const destChunk of destChunks) {
      await Promise.all(
        destChunk.map(async ([isoCode, destInfo]) => {
          const existing = existingDestinations.find((d) => d.isoCode.toUpperCase() === isoCode)
          const existingProviders = existing?.supportedProviders || []
          const updatedProviders = Array.from(new Set([...existingProviders, 'Airalo']))
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
              supportedProviders: ['Airalo'],
            },
          })

          destinationIdMap.set(isoCode, destination.id)
          destinationsSynced++
        })
      )
    }

    // 5. Pre-load existing package IDs for Airalo
    const existingPackageIds = new Set(
      (
        await prisma.unifiedPackage.findMany({
          where: { supplierId: supplier.id },
          select: { supplierPackageId: true },
        })
      ).map((p) => p.supplierPackageId)
    )

    const totalPackagesFound = allPackageItems.length
    const packagesToProcess = options.limit
      ? allPackageItems.slice(0, options.limit)
      : allPackageItems

    // 6. Process packages in chunks
    const packageChunks = chunkArray(packagesToProcess, batchSize)
    console.log(`[Airalo Sync] Processing ${packagesToProcess.length} packages in ${packageChunks.length} chunks...`)

    for (let chunkIdx = 0; chunkIdx < packageChunks.length; chunkIdx++) {
      const chunk = packageChunks[chunkIdx]

      await Promise.all(
        chunk.map(async ({ countryIso, countryTitle, pkg, operator }) => {
          const packageIdStr = String(pkg.id || `${countryIso}_${pkg.amount}MB_${pkg.day}D`)

          try {
            const destinationId = destinationIdMap.get(countryIso) || destinationIdMap.get('GLOBAL')!
            const networkType = operator?.network_type || '5G/4G/LTE'
            const wholesaleCostUSD = Number(pkg.price ?? pkg.net_price ?? 0)
            const retailPriceUSD = calculateAiraloRetailPrice(
              wholesaleCostUSD,
              marginPercentage,
              minimumMarkupUSD
            )

            // Data amount: if unlimited or 0, check if amount is in MB or data string
            let dataAmountMB = Number(pkg.amount) || 0
            if (dataAmountMB === 0 && !pkg.is_unlimited && pkg.data) {
              const dataMatch = pkg.data.match(/(\d+(\.\d+)?)\s*(GB|MB)/i)
              if (dataMatch) {
                const val = parseFloat(dataMatch[1])
                const unit = dataMatch[3].toUpperCase()
                dataAmountMB = unit === 'GB' ? Math.round(val * 1024) : Math.round(val)
              }
            }

            const validityDays = Number(pkg.day) || 7
            const isExisting = existingPackageIds.has(packageIdStr)

            await prisma.unifiedPackage.upsert({
              where: {
                supplierId_supplierPackageId: {
                  supplierId: supplier.id,
                  supplierPackageId: packageIdStr,
                },
              },
              update: {
                destinationId,
                supplierName: 'Airalo',
                destinationName: countryTitle,
                dataAmountMB,
                validityDays,
                networkType,
                isUnlimited: Boolean(pkg.is_unlimited),
                isTopUpSupported: pkg.type === 'topup' || true,
                wholesaleCostUSD,
                retailPriceUSD,
                isActive: true,
                updatedAt: new Date(),
              },
              create: {
                supplierId: supplier.id,
                destinationId,
                supplierPackageId: packageIdStr,
                supplierName: 'Airalo',
                destinationName: countryTitle,
                dataAmountMB,
                validityDays,
                networkType,
                isUnlimited: Boolean(pkg.is_unlimited),
                isTopUpSupported: pkg.type === 'topup' || true,
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
          } catch (pkgError) {
            errors.push({
              packageId: packageIdStr,
              error: pkgError instanceof Error ? pkgError.message : String(pkgError),
            })
          }
        })
      )

      if ((chunkIdx + 1) % 20 === 0 || chunkIdx === packageChunks.length - 1) {
        console.log(`[Airalo Sync] Progress: ${processed}/${packagesToProcess.length} packages processed`)
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
      supplier: 'Airalo',
      destinationsSynced,
      totalPackagesFound,
      processed,
      packagesCreated,
      packagesUpdated,
      errors,
      durationMs: Date.now() - startTime,
    }
  } catch (error) {
    console.error('[syncAiraloCatalog] Sync pipeline failed:', error)
    return {
      success: false,
      supplier: 'Airalo',
      destinationsSynced: 0,
      totalPackagesFound: 0,
      processed,
      packagesCreated,
      packagesUpdated,
      errors: [
        {
          packageId: 'ROOT_PIPELINE',
          error: error instanceof Error ? error.message : String(error),
        },
      ],
      durationMs: Date.now() - startTime,
    }
  }
}
