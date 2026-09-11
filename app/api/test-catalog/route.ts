import { NextResponse } from 'next/server'
import { fetchEsimGoCatalog } from '@/lib/providers/esim-go'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const catalog = await fetchEsimGoCatalog()

    if (!catalog) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to retrieve catalog from eSIM Go. Check server logs for details.',
          data: null,
        },
        { status: 502 }
      )
    }

    const bundles = catalog.bundles || []
    const totalCount = catalog.total ?? bundles.length

    return NextResponse.json({
      success: true,
      count: totalCount,
      bundleCount: bundles.length,
      data: catalog,
    })
  } catch (error) {
    console.error('[API /api/test-catalog] Error testing catalog endpoint:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error,
      },
      { status: 500 }
    )
  }
}
