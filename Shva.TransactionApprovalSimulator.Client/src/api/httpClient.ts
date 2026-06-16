import type { ApiErrorResponse } from '../types/transactions'
import { clearAuthToken, getAuthToken } from './authToken'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

let unauthorizedHandler: (() => void) | undefined

export const setUnauthorizedHandler = (handler: (() => void) | undefined) => {
  unauthorizedHandler = handler
}

const getApiBaseUrl = () => {
  if (!API_BASE_URL) {
    throw new Error('Missing VITE_API_BASE_URL. Add it to your environment configuration.')
  }

  return API_BASE_URL.replace(/\/+$/, '')
}

const readJsonResponse = async <T>(response: Response): Promise<T | undefined> => {
  if (response.status === 204) {
    return undefined
  }

  const contentType = response.headers.get('content-type')
  if (!contentType?.includes('application/json')) {
    return undefined
  }

  return (await response.json()) as T
}

const isApiErrorResponse = (value: unknown): value is ApiErrorResponse => {
  return typeof value === 'object' && value !== null
}

const formatApiError = (fallback: string, errorResponse?: ApiErrorResponse) => {
  if (!errorResponse) {
    return fallback
  }

  if (errorResponse.message) {
    return errorResponse.message
  }

  if (errorResponse.error) {
    return errorResponse.error
  }

  if (errorResponse.errors) {
    return Object.entries(errorResponse.errors)
      .flatMap(([field, messages]) => messages.map((message) => `${field}: ${message}`))
      .join('\n')
  }

  return fallback
}

const buildRequestHeaders = (headers?: HeadersInit) => {
  const requestHeaders = new Headers(headers)
  const token = getAuthToken()

  if (token && !requestHeaders.has('Authorization')) {
    requestHeaders.set('Authorization', `Bearer ${token}`)
  }

  return requestHeaders
}

const ensureOkResponse = async (response: Response) => {
  if (response.ok) {
    return
  }

  if (response.status === 401) {
    clearAuthToken()
    unauthorizedHandler?.()
  }

  const fallback = `Request failed with status ${response.status}${response.statusText ? ` ${response.statusText}` : ''}.`
  const errorResponse = await readJsonResponse<unknown>(response)

  throw new Error(formatApiError(fallback, isApiErrorResponse(errorResponse) ? errorResponse : undefined))
}

export const apiRequest = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: buildRequestHeaders(init?.headers),
  })

  await ensureOkResponse(response)

  const body = await readJsonResponse<T>(response)
  if (body === undefined) {
    throw new Error('Request succeeded but returned no response body.')
  }

  return body
}
