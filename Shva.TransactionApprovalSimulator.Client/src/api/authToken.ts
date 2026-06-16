const AUTH_TOKEN_STORAGE_KEY = 'shvaTransactionSimulatorAuthToken'

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
}

export const setAuthToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
}

export const clearAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
}
