import { HeroVisual } from './HeroVisual'
import { SimulatorControls } from './SimulatorControls'

type HeroSectionProps = {
  onTransactionSubmitted: () => void
}

export function HeroSection({ onTransactionSubmitted }: HeroSectionProps) {
  return (
    <main className="simulator-main">
      <SimulatorControls onTransactionSubmitted={onTransactionSubmitted} />
      <section className="hero-copy">
        <span className="eyebrow">TRANSACTION SIMULATOR</span>
        <h1>Will this transaction be approved?</h1>
        <HeroVisual />
      </section>
    </main>
  )
}
