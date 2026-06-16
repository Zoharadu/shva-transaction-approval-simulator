import { LanguageToggle } from './LanguageToggle'
import { ShvaLogo } from './ShvaLogo'

export function Header() {
  return (
    <header className="app-header">
      <ShvaLogo />
      <LanguageToggle />
    </header>
  )
}
