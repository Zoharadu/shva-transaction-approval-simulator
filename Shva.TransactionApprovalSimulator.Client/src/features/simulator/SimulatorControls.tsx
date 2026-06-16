import { TimePickerCard } from './TimePickerCard'
import { TimezoneSelect } from './TimezoneSelect'

export function SimulatorControls() {
  return (
    <div className="simulator-controls">
      <TimezoneSelect />
      <TimePickerCard />
    </div>
  )
}
