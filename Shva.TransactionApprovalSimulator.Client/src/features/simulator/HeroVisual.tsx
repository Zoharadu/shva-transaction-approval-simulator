export function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="visual-line line-one" />
      <div className="visual-line line-two" />
      <div className="visual-line line-three" />
      <div className="visual-text">
        <strong>תשלום מאובטח</strong>
        <span>העסקה שלך מוגנת ומאושרת</span>
      </div>
      <div className="receipt-stack">
        <div className="receipt-card card-back" />
        <div className="receipt-card card-front">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-logo">shva</div>
        <div className="phone-check" />
        <div className="phone-line" />
        <div className="phone-line short" />
      </div>
    </div>
  )
}
