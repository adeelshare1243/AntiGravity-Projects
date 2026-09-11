import { syncEsimGoCatalog } from '../lib/services/sync-esim-go'
import { syncAiraloCatalog } from '../lib/services/sync-airalo'
import { prisma } from '../lib/prisma'

async function main() {
  console.log('==================================================')
  console.log('🚀 STARTING FULL CATALOG SYNCHRONIZATION PIPELINE')
  console.log('==================================================\n')

  // 1. Sync eSIM Go
  console.log('⏳ [1/2] Syncing eSIM Go catalog...')
  const esimGoResult = await syncEsimGoCatalog()
  console.log('✅ eSIM Go Sync Completed:')
  console.log(`   - Total Fetched: ${esimGoResult.totalFetched}`)
  console.log(`   - Processed: ${esimGoResult.processed}`)
  console.log(`   - Packages Created: ${esimGoResult.packagesCreated}`)
  console.log(`   - Packages Updated: ${esimGoResult.packagesUpdated}`)
  console.log(`   - Destinations Synced: ${esimGoResult.destinationsSynced}`)
  console.log(`   - Errors: ${esimGoResult.errors.length}`)
  console.log(`   - Duration: ${(esimGoResult.durationMs / 1000).toFixed(2)}s\n`)

  // 2. Sync Airalo
  console.log('⏳ [2/2] Syncing Airalo catalog...')
  const airaloResult = await syncAiraloCatalog()
  console.log('✅ Airalo Sync Completed:')
  console.log(`   - Destinations Synced: ${airaloResult.destinationsSynced}`)
  console.log(`   - Total Packages Found: ${airaloResult.totalPackagesFound}`)
  console.log(`   - Processed: ${airaloResult.processed}`)
  console.log(`   - Packages Created: ${airaloResult.packagesCreated}`)
  console.log(`   - Packages Updated: ${airaloResult.packagesUpdated}`)
  console.log(`   - Errors: ${airaloResult.errors.length}`)
  console.log(`   - Duration: ${(airaloResult.durationMs / 1000).toFixed(2)}s\n`)

  // 3. Inspect final database metrics
  console.log('==================================================')
  console.log('📊 DATABASE INVENTORY SUMMARY')
  console.log('==================================================')
  const suppliers = await prisma.supplier.findMany()
  for (const s of suppliers) {
    console.log(`🏢 Supplier: ${s.name}`)
    console.log(`   - Total Destinations: ${s.totalDestinations}`)
    console.log(`   - Total Active Packages: ${s.totalPackages}`)
    console.log(`   - Last Sync At: ${s.lastSyncAt?.toISOString() || 'Never'}`)
  }

  const totalDestinationsCount = await prisma.destination.count()
  const totalPackagesCount = await prisma.unifiedPackage.count()
  const sampleDestinations = await prisma.destination.findMany({
    take: 5,
    select: { isoCode: true, name: true, bannerUrl: true, flagUrl: true },
  })

  console.log(`\n🌍 Total Destinations in DB: ${totalDestinationsCount}`)
  console.log(`📦 Total Packages in DB: ${totalPackagesCount}`)
  console.log('\n🔍 Sample Destinations with Banners:')
  console.table(sampleDestinations)

  console.log('\n🎉 ALL CATALOGS SYNCHRONIZED AND STORED IN DATABASE SUCCESSFULLY!')
}

main()
  .catch((err) => {
    console.error('❌ Sync failed with critical error:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
