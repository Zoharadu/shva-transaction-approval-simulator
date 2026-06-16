export type Region = 'Israel' | 'France' | 'USA' | 'Japan'

export type ApprovedTransaction = {
  id: string
  time: string
  region: string
}

export const TransactionStatus = {
  Approved: 0,
  Rejected: 1,
} as const

export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus]

export interface SubmitTransactionRequest {
  region: Region
  submittedDateTime: string
}

export interface TransactionResponse {
  id: string
  region: string
  submittedDateTimeUtc: string
  localDateTime: string
  status: TransactionStatus
}

export interface ApprovedTransactionResponse {
  id: string
  region: string
  localDateTime: string
}

export interface ApiErrorResponse {
  message?: string
  error?: string
  errors?: Record<string, string[]>
}
