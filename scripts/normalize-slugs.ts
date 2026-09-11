import { prisma } from '../lib/prisma'

async function main() {
  console.log('Updating all destination slugs in PostgreSQL directly...')
  
  // Clean special chars, replace spaces with hyphen, lowercase
  const count = await prisma.$executeRawUnsafe(`
    UPDATE "Destination"
    SET "slug" = TRIM(BOTH '-' FROM LOWER(REGEXP_REPLACE(REGEXP_REPLACE(TRIM("name"), '[^a-zA-Z0-9\\s-]', '', 'g'), '[\\s-]+', '-', 'g')))
  `)
  console.log(`✅ Updated ${count} rows with full-name slugs.`)

  // Check if any slug is empty or duplicate
  const duplicates: any[] = await prisma.$queryRawUnsafe(`
    SELECT "slug", COUNT(*) 
    FROM "Destination" 
    GROUP BY "slug" 
    HAVING COUNT(*) > 1
  `)

  if (duplicates.length > 0) {
    console.log('Resolving duplicates:', duplicates)
    for (const dup of duplicates) {
      await prisma.$executeRawUnsafe(`
        UPDATE "Destination"
        SET "slug" = "slug" || '-' || LOWER("isoCode")
        WHERE "slug" = $1
      `, dup.slug)
    }
  }

  // Create unique index
  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "Destination_slug_key" ON "Destination"("slug");
  `)
  console.log('✅ Unique index Destination_slug_key created/verified.')

  const sample: any = await prisma.$queryRawUnsafe(`
    SELECT "name", "isoCode", "slug" FROM "Destination" ORDER BY "name" ASC LIMIT 10
  `)
  console.log('\nSample Destinations:')
  console.table(sample)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
