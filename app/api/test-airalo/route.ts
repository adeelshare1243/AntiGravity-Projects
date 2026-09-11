import { NextResponse } from 'next/server'
import { fetchAiraloCatalog, AiraloCountry, AiraloPackage } from '@/lib/providers/airalo'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const catalog = await fetchAiraloCatalog({ limit: 10 })

    if (!catalog) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to retrieve catalog from Airalo API. Check server logs and credentials.',
          data: null,
        },
        { status: 502 }
      )
    }

    const rawData = catalog.data || []
    let totalPackages = 0

    if (Array.isArray(rawData)) {
      for (const item of rawData) {
        const country = item as AiraloCountry & {
          operators?: Array<{ packages?: AiraloPackage[] }>
        }
        if (Array.isArray(country.operators)) {
          for (const op of country.operators) {
            if (Array.isArray(op.packages)) {
              totalPackages += op.packages.length
            }
          }
        } else if (Array.isArray(country.packages)) {
          totalPackages += country.packages.length
        }
      }
    }

    return NextResponse.json({
      success: true,
      countriesCount: Array.isArray(rawData) ? rawData.length : 0,
      totalPackagesCount: totalPackages,
      data: catalog,
    })
  } catch (error) {
    console.error('[API /api/test-airalo] Error testing Airalo catalog endpoint:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred contacting Airalo',
        details: error,
      },
      { status: 500 }
    )
  }
}
