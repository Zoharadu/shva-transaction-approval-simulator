import type {
  ApprovedTransactionResponse,
  SubmitTransactionRequest,
  TransactionResponse,
} from '../types/transactions'
import { apiRequest } from './httpClient'

export const submitTransaction = async (
  request: SubmitTransactionRequest,
): Promise<TransactionResponse> => {
  return apiRequest<TransactionResponse>('/api/transactions/simulate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })
}

export const getApprovedTransactions = async (): Promise<ApprovedTransactionResponse[]> => {
  return apiRequest<ApprovedTransactionResponse[]>('/api/transactions/approved')
}

export const getTransactions = async (): Promise<TransactionResponse[]> => {
  return apiRequest<TransactionResponse[]>('/api/transactions')
}

export const getTransactionById = async (id: string): Promise<TransactionResponse> => {
  return apiRequest<TransactionResponse>(`/api/transactions/${encodeURIComponent(id)}`)
}
