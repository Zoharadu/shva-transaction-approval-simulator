import { useState } from 'react'
import { SUPPORTED_REGIONS } from '../../constants/regions'
import type { Region } from '../../types/transactions'

type TimezoneSelectProps = {
  selectedRegion: Region
  onRegionChange: (region: Region) => void
}

export function TimezoneSelect({ selectedRegion, onRegionChange }: TimezoneSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="timezone-select">
      <button
        type="button"
        className="timezone-trigger"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{selectedRegion}</span>
        <span className="search-icon" aria-hidden="true" />
      </button>

      {isOpen && (
        <ul className="timezone-menu">
          {SUPPORTED_REGIONS.map((region) => (
            <li key={region}>
              <button
                type="button"
                onClick={() => {
                  onRegionChange(region)
                  setIsOpen(false)
                }}
              >
                {region}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
