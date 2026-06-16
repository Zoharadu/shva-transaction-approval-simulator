import phoneImage from '../../assets/Rectangle.svg'

export function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="visual-line line-one" />
      <div className="visual-line line-two" />
      <div className="visual-line line-three" />
      <div className="visual-text">
        <strong>
          רשת התשלומים
          <br />
          המאובטחת, היציבה
          <br />
          והמתקדמת בישראל
        </strong>
      </div>
      <div className="receipt-stack">
        <div className="receipt-card card-back" />
        <div className="receipt-card card-front">
          <span />
          <span />
          <span />
        </div>
      </div>
      <img className="phone-asset" src={phoneImage} alt="" />
    </div>
  )
}
