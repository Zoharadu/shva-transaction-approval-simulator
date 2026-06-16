export type Region = 'Israel' | 'France' | 'USA' | 'Japan'

export const TransactionStatus = {
  Approved: 0,
  Rejected: 1,
} as const

export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus]

export interface SubmitTransactionRequest {
  cardNumber: string
  expirationMonth: number
  expirationYear: number
  cvv: string
  amount: number
  region: Region
}

export interface TransactionResponse {
  transactionId: string
  status: TransactionStatus
  message: string
  amount: number
  region: Region
}

export interface ApprovedTransactionResponse extends TransactionResponse {
  status: typeof TransactionStatus.Approved
  approvedAt: string
}

export interface ApiErrorResponse {
  message?: string
  error?: string
  errors?: Record<string, string[]>
}
