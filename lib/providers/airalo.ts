/**
 * Airalo Partner API Client (v2)
 * Provider Abstraction Layer for Airalo eSIM Services
 */

const AIRALO_BASE_URL = process.env.AIRALO_BASE_URL || 'https://partners-api.airalo.com/v2'

export interface AiraloTokenResponse {
  data: {
    token_type: string
    expires_in: number
    access_token: string
  }
  meta?: Record<string, unknown>
}

export interface AiraloOperator {
  id: number
  title: string
  is_roaming: boolean
  info: string[]
  network_type?: string
  plan_type?: string
  countries?: Array<{
    country_code: string
    title: string
    image?: { url: string }
  }>
}

export interface AiraloPackage {
  id: string | number
  type: string // "sim" | "topup"
  price: number // Wholesale net price or retail
  net_price?: number
  amount: number // Data amount in MB (or GB)
  day: number // Validity in days
  is_unlimited: boolean
  title: string
  data: string // e.g. "1 GB", "10 GB"
  short_info?: string
  operator?: AiraloOperator
}

export interface AiraloCountry {
  id: number
  slug: string
  title: string
  country_code: string
  image?: {
    url: string
    width?: number
    height?: number
  }
  packages: AiraloPackage[]
}

export interface AiraloCatalogResponse {
  data: (AiraloCountry | AiraloPackage)[]
  meta?: {
    message?: string
    [key: string]: unknown
  }
}

export interface AiraloApiError {
  status: number
  message: string
  details?: unknown
}

// In-memory token cache to prevent redundant auth requests (valid for 24h)
let cachedToken: {
  accessToken: string
  expiresAt: number // Timestamp in ms
} | null = null

/**
 * Obtains or reuses an active OAuth2 Bearer Access Token from Airalo
 */
export async function getAiraloAccessToken(forceRefresh = false): Promise<string> {
  const now = Date.now()

  // Return cached token if valid with a 60-second safety buffer
  if (!forceRefresh && cachedToken && cachedToken.expiresAt > now + 60 * 1000) {
    return cachedToken.accessToken
  }

  const clientId = process.env.AIRALO_CLIENT_ID
  const clientSecret = process.env.AIRALO_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('AIRALO_CLIENT_ID or AIRALO_CLIENT_SECRET is missing from environment variables.')
  }

  const tokenUrl = `${AIRALO_BASE_URL}/token`

  const bodyParams = new URLSearchParams()
  bodyParams.append('grant_type', 'client_credentials')
  bodyParams.append('client_id', clientId)
  bodyParams.append('client_secret', clientSecret)

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: bodyParams.toString(),
      cache: 'no-store',
    })

    if (!response.ok) {
      let errorBody: unknown = null
      try {
        errorBody = await response.json()
      } catch {
        errorBody = await response.text()
      }

      console.error(`[Airalo Auth Error] Status ${response.status} fetching token:`, errorBody)
      throw {
        status: response.status,
        message: `Airalo token authentication failed (${response.status})`,
        details: errorBody,
      } as AiraloApiError
    }

    const tokenData: AiraloTokenResponse = await response.json()

    if (!tokenData?.data?.access_token) {
      throw new Error('Airalo response did not contain access_token.')
    }

    const expiresInSeconds = tokenData.data.expires_in || 86400
    cachedToken = {
      accessToken: tokenData.data.access_token,
      expiresAt: now + expiresInSeconds * 1000,
    }

    return cachedToken.accessToken
  } catch (error) {
    console.error('[getAiraloAccessToken] Error obtaining Airalo OAuth2 token:', error)
    throw error
  }
}

/**
 * Authenticated fetch wrapper for Airalo API requests
 */
async function airaloFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const token = await getAiraloAccessToken(isRetry)
  const url = `${AIRALO_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(options.headers || {}),
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      cache: options.cache || 'no-store',
    })

    // Handle token expiration/revocation with single automatic retry
    if (response.status === 401 && !isRetry) {
      console.warn('[Airalo API] Received 401 Unauthorized. Retrying with a refreshed access token...')
      return airaloFetch<T>(endpoint, options, true)
    }

    if (!response.ok) {
      let errorBody: unknown = null
      try {
        errorBody = await response.json()
      } catch {
        errorBody = await response.text()
      }

      console.error(`[Airalo API Error] ${response.status} ${response.statusText} on ${url}:`, errorBody)
      throw {
        status: response.status,
        message: `Airalo API request failed with status ${response.status}: ${response.statusText}`,
        details: errorBody,
      } as AiraloApiError
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    if ((error as AiraloApiError).status) {
      throw error
    }

    console.error(`[Airalo Network Error] Failed requesting ${url}:`, error)
    throw {
      status: 500,
      message: error instanceof Error ? error.message : 'Unknown network error occurred contacting Airalo.',
      details: error,
    } as AiraloApiError
  }
}

/**
 * Fetches the complete package catalog from Airalo API
 * Supports package type filtering (e.g. "local", "global", "regions")
 * Automatically paginates through all pages until all packages/destinations are retrieved.
 */
export async function fetchAiraloCatalog(
  queryParams?: Record<string, string | number | boolean | undefined>
): Promise<AiraloCatalogResponse | null> {
  try {
    // If a specific page was explicitly requested, fetch only that single page
    if (queryParams?.page !== undefined) {
      let endpoint = '/packages'
      const searchParams = new URLSearchParams()
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined) {
          searchParams.append(key, String(value))
        }
      }
      const queryString = searchParams.toString()
      if (queryString) endpoint += `?${queryString}`

      return await airaloFetch<AiraloCatalogResponse>(endpoint, { method: 'GET' })
    }

    // Exhaustive pagination loop to fetch all pages
    const allData: (AiraloCountry | AiraloPackage)[] = []
    let currentPage = 1
    let hasMorePages = true
    const limit = typeof queryParams?.limit === 'number' ? queryParams.limit : 100
    let lastMeta: Record<string, unknown> | undefined

    while (hasMorePages) {
      let endpoint = '/packages'
      const searchParams = new URLSearchParams()

      if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
          if (value !== undefined && key !== 'page' && key !== 'limit') {
            searchParams.append(key, String(value))
          }
        }
      }

      searchParams.append('page', String(currentPage))
      searchParams.append('limit', String(limit))

      const queryString = searchParams.toString()
      if (queryString) endpoint += `?${queryString}`

      const response = await airaloFetch<AiraloCatalogResponse & {
        links?: { next?: string | null }
        meta?: { current_page?: number; last_page?: number; total?: number; per_page?: number }
      }>(endpoint, { method: 'GET' })

      if (response?.data && Array.isArray(response.data)) {
        allData.push(...response.data)
        lastMeta = response.meta

        const lastPage = response.meta?.last_page
        const nextPage = response.links?.next

        if (typeof lastPage === 'number') {
          hasMorePages = currentPage < lastPage
        } else if (nextPage !== undefined) {
          hasMorePages = Boolean(nextPage)
        } else {
          hasMorePages = response.data.length >= limit
        }

        currentPage++
      } else {
        hasMorePages = false
      }
    }

    return {
      data: allData,
      meta: lastMeta,
    }
  } catch (error) {
    console.error('[fetchAiraloCatalog] Failed to retrieve catalog from Airalo:', error)
    return null
  }
}
