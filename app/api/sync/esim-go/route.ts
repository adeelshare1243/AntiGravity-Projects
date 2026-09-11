import { NextRequest, NextResponse } from 'next/server'
import { syncEsimGoCatalog } from '@/lib/services/sync-esim-go'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes timeout for exhaustive catalog synchronization

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown> = {}
    try {
      body = await request.json()
    } catch {
      // Empty body is acceptable, fallback to defaults
    }

    const limit = typeof body.limit === 'number' ? body.limit : undefined
    const countries = typeof body.countries === 'string' ? body.countries : undefined
    const marginPercentage =
      typeof body.marginPercentage === 'number' ? body.marginPercentage : undefined
    const minimumMarkupUSD =
      typeof body.minimumMarkupUSD === 'number' ? body.minimumMarkupUSD : undefined
    const batchSize = typeof body.batchSize === 'number' ? body.batchSize : undefined

    const result = await syncEsimGoCatalog({
      limit,
      countries,
      marginPercentage,
      minimumMarkupUSD,
      batchSize,
    })

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'eSIM Go sync pipeline encountered an error.',
          details: result,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized eSIM Go catalog.`,
      stats: {
        totalFetched: result.totalFetched,
        processed: result.processed,
        packagesCreated: result.packagesCreated,
        packagesUpdated: result.packagesUpdated,
        destinationsSynced: result.destinationsSynced,
        durationSeconds: (result.durationMs / 1000).toFixed(2),
        errorCount: result.errors.length,
      },
      errors: result.errors.length > 0 ? result.errors.slice(0, 10) : undefined,
    })
  } catch (error) {
    console.error('[API /api/sync/esim-go] Unexpected failure:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown internal server error',
      },
      { status: 500 }
    )
  }
}

// Allow GET for manual triggering or webhook triggering
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const limitParam = searchParams.get('limit')
  const countries = searchParams.get('countries') || undefined
  const limit = limitParam ? parseInt(limitParam, 10) : undefined // Undefined means full sync

  const result = await syncEsimGoCatalog({ limit, countries })

  return NextResponse.json({
    success: result.success,
    mode: limit ? `Preview/Limited Sync (limit: ${limit})` : 'Full Exhaustive Sync',
    stats: {
      totalFetched: result.totalFetched,
      processed: result.processed,
      packagesCreated: result.packagesCreated,
      packagesUpdated: result.packagesUpdated,
      destinationsSynced: result.destinationsSynced,
      durationSeconds: (result.durationMs / 1000).toFixed(2),
      errorCount: result.errors.length,
    },
    errors: result.errors.length > 0 ? result.errors.slice(0, 10) : undefined,
  })
}
