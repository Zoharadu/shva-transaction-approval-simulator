export function LanguageToggle() {
  return (
    <div className="language-toggle" aria-label="Language selector">
      <button type="button">ENG</button>
      <button type="button" className="active">
        Hebrew
      </button>
    </div>
  )
}
