import { useState } from 'react'
import { Header } from './features/layout/Header'
import { HeroSection } from './features/simulator/HeroSection'
import { ApprovedTransactionsCarousel } from './features/transactions/ApprovedTransactionsCarousel'
import './App.css'

function App() {
  const [approvedTransactionsRefreshKey, setApprovedTransactionsRefreshKey] = useState(0)

  return (
    <div className="app-canvas">
      <Header />
      <HeroSection
        onTransactionSubmitted={() => setApprovedTransactionsRefreshKey((refreshKey) => refreshKey + 1)}
      />
      <ApprovedTransactionsCarousel refreshKey={approvedTransactionsRefreshKey} />
    </div>
  )
}

export default App
