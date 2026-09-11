import { NextRequest, NextResponse } from 'next/server'
import { syncAiraloCatalog } from '@/lib/services/sync-airalo'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes timeout for exhaustive catalog synchronization

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown> = {}
    try {
      body = await request.json()
    } catch {
      // Empty body fallback
    }

    const limit = typeof body.limit === 'number' ? body.limit : undefined
    const marginPercentage =
      typeof body.marginPercentage === 'number' ? body.marginPercentage : undefined
    const minimumMarkupUSD =
      typeof body.minimumMarkupUSD === 'number' ? body.minimumMarkupUSD : undefined
    const packageType = typeof body.packageType === 'string' ? body.packageType : undefined
    const batchSize = typeof body.batchSize === 'number' ? body.batchSize : undefined

    const result = await syncAiraloCatalog({
      limit,
      marginPercentage,
      minimumMarkupUSD,
      packageType,
      batchSize,
    })

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Airalo sync pipeline encountered an error.',
          details: result,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully synchronized Airalo catalog.',
      stats: {
        destinationsSynced: result.destinationsSynced,
        totalPackagesFound: result.totalPackagesFound,
        processed: result.processed,
        packagesCreated: result.packagesCreated,
        packagesUpdated: result.packagesUpdated,
        durationSeconds: (result.durationMs / 1000).toFixed(2),
        errorCount: result.errors.length,
      },
      errors: result.errors.length > 0 ? result.errors.slice(0, 10) : undefined,
    })
  } catch (error) {
    console.error('[API /api/sync/airalo] Unexpected failure:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown internal server error',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const limitParam = searchParams.get('limit')
  const packageType = searchParams.get('type') || undefined
  const limit = limitParam ? parseInt(limitParam, 10) : undefined // Undefined means full sync

  const result = await syncAiraloCatalog({ limit, packageType })

  return NextResponse.json({
    success: result.success,
    mode: limit ? `Preview/Limited Sync (limit: ${limit})` : 'Full Exhaustive Sync',
    stats: {
      destinationsSynced: result.destinationsSynced,
      totalPackagesFound: result.totalPackagesFound,
      processed: result.processed,
      packagesCreated: result.packagesCreated,
      packagesUpdated: result.packagesUpdated,
      durationSeconds: (result.durationMs / 1000).toFixed(2),
      errorCount: result.errors.length,
    },
    errors: result.errors.length > 0 ? result.errors.slice(0, 10) : undefined,
  })
}
