import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Helper to avoid hitting rate limits too fast
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function updateDestinationBanners() {
  console.log('==================================================');
  console.log('🌍 STARTING DESTINATION BANNER UPDATE PIPELINE');
  console.log('==================================================\n');

  if (!UNSPLASH_ACCESS_KEY) {
    console.error('❌ ERROR: UNSPLASH_ACCESS_KEY is missing from your environment variables.');
    console.error('Please add UNSPLASH_ACCESS_KEY="your_unsplash_access_key" to your .env file.\n');
    process.exit(1);
  }

  const destinations = await prisma.destination.findMany({
    orderBy: { name: 'asc' },
  });
  console.log(`Found ${destinations.length} destinations to process.\n`);

  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < destinations.length; i++) {
    const dest = destinations[i];
    const progress = `[${i + 1}/${destinations.length}]`;

    try {
      console.log(`${progress} Fetching image for: ${dest.name}...`);

      // Search Unsplash for a high-quality landscape photo of the country
      const searchTerm = encodeURIComponent(`${dest.name} landscape travel`);
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${searchTerm}&orientation=landscape&per_page=1`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            'Accept-Version': 'v1',
          },
        }
      );

      // Check rate limits from Unsplash response headers
      const remainingLimit = response.headers.get('x-ratelimit-remaining');
      if (remainingLimit) {
        console.log(`   (Rate limit remaining: ${remainingLimit})`);
      }

      if (response.status === 403 || response.status === 429) {
        console.warn(`⚠️ Unsplash Rate Limit Reached! (HTTP ${response.status})`);
        console.warn('Free tier allows 50 requests/hour. Please re-run later to resume.');
        break;
      }

      if (!response.ok) {
        console.error(`❌ HTTP Error ${response.status}: ${response.statusText}`);
        errorCount++;
        await delay(2000);
        continue;
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        // Grab the regular-sized image URL (high resolution landscape)
        const imageUrl = data.results[0].urls.regular;

        // Update the database
        await prisma.destination.update({
          where: { id: dest.id },
          data: { bannerUrl: imageUrl },
        });

        console.log(`✅ Updated ${dest.name} -> ${imageUrl}`);
        updatedCount++;
      } else {
        console.log(`⚠️ No image found for ${dest.name}`);
        skippedCount++;
      }

      // Pause for 2 seconds to respect Unsplash's free tier API rate limits (50 requests/hour)
      await delay(2000);
    } catch (error) {
      console.error(`❌ Error updating ${dest.name}:`, error);
      errorCount++;
      await delay(2000);
    }
  }

  console.log('\n==================================================');
  console.log('🎉 BANNER UPDATE SUMMARY');
  console.log('==================================================');
  console.log(`- Updated: ${updatedCount}`);
  console.log(`- Skipped / No Results: ${skippedCount}`);
  console.log(`- Errors: ${errorCount}`);
  console.log('==================================================\n');
}

updateDestinationBanners()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
