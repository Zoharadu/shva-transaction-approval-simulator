import { HeroVisual } from './HeroVisual'
import { SimulatorControls } from './SimulatorControls'

export function HeroSection() {
  return (
    <main className="simulator-main">
      <SimulatorControls />
      <section className="hero-copy">
        <span className="eyebrow">TRANSACTION SIMULATOR</span>
        <h1>Will this transaction be approved?</h1>
        <HeroVisual />
      </section>
    </main>
  )
}
