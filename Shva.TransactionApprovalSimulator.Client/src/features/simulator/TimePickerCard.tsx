type TimePickerCardProps = {
  hour: number
  minute: number
  isSubmitting: boolean
  submitError: string | null
  onHourChange: (hour: number) => void
  onMinuteChange: (minute: number) => void
  onCancel: () => void
  onSubmit: () => void
}

const formatTimeUnit = (value: number) => value.toString().padStart(2, '0')

const clampTimeUnit = (value: number, min: number, max: number) => {
  if (Number.isNaN(value)) {
    return min
  }

  return Math.min(Math.max(value, min), max)
}

export function TimePickerCard({
  hour,
  minute,
  isSubmitting,
  submitError,
  onHourChange,
  onMinuteChange,
  onCancel,
  onSubmit,
}: TimePickerCardProps) {
  const handleHourChange = (value: string) => {
    onHourChange(clampTimeUnit(Number(value), 0, 23))
  }

  const handleMinuteChange = (value: string) => {
    onMinuteChange(clampTimeUnit(Number(value), 0, 59))
  }

  return (
    <div className="time-picker-card" aria-label="Time picker">
      <div className="time-fields">
        <div className="time-unit">
          <input
            type="number"
            className="time-box active"
            aria-label="Transaction hour"
            min="0"
            max="23"
            value={formatTimeUnit(hour)}
            disabled={isSubmitting}
            onChange={(event) => handleHourChange(event.target.value)}
          />
          <span>Hour</span>
        </div>
        <span className="time-separator">:</span>
        <div className="time-unit">
          <input
            type="number"
            className="time-box"
            aria-label="Transaction minute"
            min="0"
            max="59"
            value={formatTimeUnit(minute)}
            disabled={isSubmitting}
            onChange={(event) => handleMinuteChange(event.target.value)}
          />
          <span>Minute</span>
        </div>
      </div>
      <div className="time-actions">
        <span className="time-clock-icon" aria-hidden="true" />
        <button type="button" disabled={isSubmitting} onClick={onCancel}>
          Cancel
        </button>
        <button type="button" disabled={isSubmitting} onClick={onSubmit}>
          {isSubmitting ? 'Submitting...' : 'OK'}
        </button>
      </div>
      {submitError && <p role="alert">{submitError}</p>}
    </div>
  )
}
