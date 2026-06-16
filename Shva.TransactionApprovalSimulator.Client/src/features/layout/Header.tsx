import { LanguageToggle } from './LanguageToggle'
import { ShvaLogo } from './ShvaLogo'

interface HeaderProps {
  onLogout?: () => void
}

export function Header({ onLogout }: HeaderProps) {
  return (
    <header className="app-header">
      <ShvaLogo />
      <div className="header-actions">
        <LanguageToggle />
        {onLogout && (
          <button className="logout-button" type="button" onClick={onLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  )
}
