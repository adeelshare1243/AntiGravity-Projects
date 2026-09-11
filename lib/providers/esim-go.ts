/**
 * eSIM Go Provider API Client (v2.2)
 * Provider Abstraction Layer for eSIM Go Services
 */

const ESIM_GO_BASE_URL = 'https://api.esim-go.com/v2.2'

export interface EsimGoCountry {
  iso: string
  name?: string
}

export interface EsimGoBundle {
  name: string
  description?: string
  dataAmount: number // in MB or Bytes depending on endpoint (v2.2 uses MB / bytes)
  duration: number // in days
  speed?: string[] // e.g. ["4G", "5G", "LTE"]
  autostart?: boolean
  unlimited?: boolean
  roamingEnabled?: (string | EsimGoCountry)[]
  price: number // Wholesale price in USD / EUR
  currency?: string
  groups?: string[]
  imageUrl?: string
  countries?: Array<{ name?: string; region?: string; iso?: string }>
}

export interface EsimGoCatalogueResponse {
  bundles?: EsimGoBundle[]
  page?: number
  pageSize?: number
  total?: number
  [key: string]: unknown
}

export interface EsimGoApiError {
  status: number
  message: string
  details?: unknown
}

/**
 * Low-level authenticated fetch wrapper for eSIM Go API
 */
async function esimGoFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const apiKey = process.env.ESIM_GO_API_KEY

  if (!apiKey) {
    throw new Error('ESIM_GO_API_KEY is not configured in environment variables.')
  }

  const url = `${ESIM_GO_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-API-Key': apiKey,
    ...(options.headers || {}),
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      cache: options.cache || 'no-store',
    })

    if (!response.ok) {
      let errorBody: unknown = null
      try {
        errorBody = await response.json()
      } catch {
        errorBody = await response.text()
      }

      console.error(`[eSIM Go API Error] ${response.status} ${response.statusText} on ${url}:`, errorBody)

      throw {
        status: response.status,
        message: `eSIM Go API request failed with status ${response.status}: ${response.statusText}`,
        details: errorBody,
      } as EsimGoApiError
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    if ((error as EsimGoApiError).status) {
      throw error
    }

    console.error(`[eSIM Go Network Error] Failed requesting ${url}:`, error)
    throw {
      status: 500,
      message: error instanceof Error ? error.message : 'Unknown network error occurred while contacting eSIM Go API.',
      details: error,
    } as EsimGoApiError
  }
}

/**
 * Fetches the complete package catalogue or filtered bundles from eSIM Go
 * Automatically paginates through all pages if multiple pages exist.
 * @param queryParams Optional search query parameters (e.g. { countries: 'TR', perPage: 100 })
 */
export async function fetchEsimGoCatalog(
  queryParams?: Record<string, string | number | boolean | undefined>
): Promise<EsimGoCatalogueResponse | null> {
  try {
    // If a specific page was explicitly requested, fetch only that single page
    if (queryParams?.page !== undefined) {
      let endpoint = '/catalogue'
      const searchParams = new URLSearchParams()
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined) {
          searchParams.append(key, String(value))
        }
      }
      const queryString = searchParams.toString()
      if (queryString) endpoint += `?${queryString}`

      const data = await esimGoFetch<EsimGoCatalogueResponse | EsimGoBundle[]>(endpoint, {
        method: 'GET',
      })

      if (Array.isArray(data)) {
        return { bundles: data, total: data.length }
      }
      return data
    }

    // Exhaustive pagination loop to fetch all pages
    const allBundles: EsimGoBundle[] = []
    let currentPage = 1
    let hasMorePages = true
    const perPage = typeof queryParams?.perPage === 'number' ? queryParams.perPage : 250

    while (hasMorePages) {
      let endpoint = '/catalogue'
      const searchParams = new URLSearchParams()

      if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
          if (value !== undefined && key !== 'page' && key !== 'perPage') {
            searchParams.append(key, String(value))
          }
        }
      }

      searchParams.append('page', String(currentPage))
      searchParams.append('perPage', String(perPage))

      const queryString = searchParams.toString()
      if (queryString) endpoint += `?${queryString}`

      const data = await esimGoFetch<EsimGoCatalogueResponse | EsimGoBundle[]>(endpoint, {
        method: 'GET',
      })

      if (Array.isArray(data)) {
        allBundles.push(...data)
        hasMorePages = false
      } else if (data && Array.isArray(data.bundles)) {
        allBundles.push(...data.bundles)

        const totalPages = typeof data.pageCount === 'number' ? data.pageCount : undefined
        if (totalPages !== undefined) {
          hasMorePages = currentPage < totalPages
        } else {
          hasMorePages = data.bundles.length >= perPage
        }

        currentPage++
      } else {
        hasMorePages = false
      }
    }

    return {
      bundles: allBundles,
      total: allBundles.length,
    }
  } catch (error) {
    console.error('[fetchEsimGoCatalog] Failed to retrieve catalogue from eSIM Go:', error)
    return null
  }
}

/**
 * Fetches a specific bundle by its unique bundle name/ID from eSIM Go
 */
export async function fetchEsimGoBundleByName(bundleName: string): Promise<EsimGoBundle | null> {
  try {
    const encodedName = encodeURIComponent(bundleName)
    const bundle = await esimGoFetch<EsimGoBundle>(`/catalogue/bundle/${encodedName}`, {
      method: 'GET',
    })
    return bundle
  } catch (error) {
    console.error(`[fetchEsimGoBundleByName] Failed to fetch bundle "${bundleName}":`, error)
    return null
  }
}
