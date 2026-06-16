import { useEffect, useState } from 'react'
import { clearAuthToken, getAuthToken, setAuthToken } from './api/authToken'
import { setUnauthorizedHandler } from './api/httpClient'
import { LoginPage } from './features/auth/LoginPage'
import { Header } from './features/layout/Header'
import { HeroSection } from './features/simulator/HeroSection'
import { ApprovedTransactionsCarousel } from './features/transactions/ApprovedTransactionsCarousel'
import './App.css'

function App() {
  const [token, setToken] = useState(() => getAuthToken())
  const [approvedTransactionsRefreshKey, setApprovedTransactionsRefreshKey] = useState(0)

  useEffect(() => {
    setUnauthorizedHandler(() => setToken(null))

    return () => setUnauthorizedHandler(undefined)
  }, [])

  const handleLogin = (newToken: string) => {
    setAuthToken(newToken)
    setToken(newToken)
  }

  const handleLogout = () => {
    clearAuthToken()
    setToken(null)
  }

  if (!token) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="app-canvas">
      <Header onLogout={handleLogout} />
      <HeroSection
        onTransactionSubmitted={() => setApprovedTransactionsRefreshKey((refreshKey) => refreshKey + 1)}
      />
      <ApprovedTransactionsCarousel refreshKey={approvedTransactionsRefreshKey} />
    </div>
  )
}

export default App
