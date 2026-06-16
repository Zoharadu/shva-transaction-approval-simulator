import { apiRequest } from './httpClient'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
}

export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  return apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })
}
