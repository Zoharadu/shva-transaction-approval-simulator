import { Header } from './features/layout/Header'
import { HeroSection } from './features/simulator/HeroSection'
import { ApprovedTransactionsCarousel } from './features/transactions/ApprovedTransactionsCarousel'
import './App.css'

function App() {
  return (
    <div className="app-canvas">
      <Header />
      <HeroSection />
      <ApprovedTransactionsCarousel />
    </div>
  )
}

export default App
