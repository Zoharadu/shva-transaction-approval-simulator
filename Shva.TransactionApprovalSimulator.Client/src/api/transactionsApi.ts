import type {
  ApiErrorResponse,
  ApprovedTransactionResponse,
  SubmitTransactionRequest,
  TransactionResponse,
} from '../types/transactions'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

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

const ensureOkResponse = async (response: Response) => {
  if (response.ok) {
    return
  }

  const fallback = `Request failed with status ${response.status}${response.statusText ? ` ${response.statusText}` : ''}.`
  const errorResponse = await readJsonResponse<unknown>(response)

  throw new Error(formatApiError(fallback, isApiErrorResponse(errorResponse) ? errorResponse : undefined))
}

export const submitTransaction = async (
  request: SubmitTransactionRequest,
): Promise<TransactionResponse> => {
  const response = await fetch(`${getApiBaseUrl()}/api/transactions/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  await ensureOkResponse(response)

  const transaction = await readJsonResponse<TransactionResponse>(response)
  if (!transaction) {
    throw new Error('Transaction submission succeeded but returned no response body.')
  }

  return transaction
}

export const getApprovedTransactions = async (): Promise<ApprovedTransactionResponse[]> => {
  const response = await fetch(`${getApiBaseUrl()}/api/transactions/approved`)

  await ensureOkResponse(response)

  return (await readJsonResponse<ApprovedTransactionResponse[]>(response)) ?? []
}
