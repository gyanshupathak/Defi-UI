/**
 * API Client - Base configuration and utilities for API calls
 * Uses native fetch (as per tech stack requirements)
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.lucidly.finance'

export interface ApiError {
  message: string
  status?: number
  code?: string
}

export class ApiClientError extends Error {
  status?: number
  code?: string

  constructor(message: string, status?: number, code?: string) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.code = code
  }
}

/**
 * Base fetch wrapper with error handling
 */
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`

  // Log the actual fetch call
  console.log('🌐 fetchApi called:')
  console.log('  - URL:', url)
  console.log('  - Method:', options?.method || 'GET')
  console.log('  - Headers:', options?.headers)

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    console.log('📡 Fetch Response:')
    console.log('  - Status:', response.status)
    console.log('  - Status Text:', response.statusText)
    console.log('  - OK:', response.ok)

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      console.log('❌ Error Response Text:', errorText)
      throw new ApiClientError(
        `API request failed: ${errorText}`,
        response.status,
        `HTTP_${response.status}`
      )
    }

    const data = await response.json()
    console.log('✅ Parsed JSON Data:', JSON.stringify(data, null, 2))
    return data as T
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }

    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new ApiClientError(
        'Network error: Unable to reach the server',
        0,
        'NETWORK_ERROR'
      )
    }

    throw new ApiClientError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      0,
      'UNKNOWN_ERROR'
    )
  }
}

/**
 * GET request helper
 */
export async function get<T>(endpoint: string, options?: RequestInit): Promise<T> {
  return fetchApi<T>(endpoint, {
    ...options,
    method: 'GET',
  })
}

/**
 * POST request helper
 */
export async function post<T>(
  endpoint: string,
  body?: unknown,
  options?: RequestInit
): Promise<T> {
  return fetchApi<T>(endpoint, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * Query parameter builder
 */
export function buildQueryString(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

