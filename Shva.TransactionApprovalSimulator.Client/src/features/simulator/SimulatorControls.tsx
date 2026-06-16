import { useState } from 'react'
import { submitTransaction } from '../../api/transactionsApi'
import type { Region } from '../../types/transactions'
import { getErrorMessage } from '../../utils/errors'
import { TimePickerCard } from './TimePickerCard'
import { TimezoneSelect } from './TimezoneSelect'

type SimulatorControlsProps = {
  onTransactionSubmitted: () => void
}

const DEFAULT_HOUR = 20
const DEFAULT_MINUTE = 0

const buildSubmittedDateTime = (hour: number, minute: number) => {
  const submittedDateTime = new Date()
  submittedDateTime.setUTCHours(hour, minute, 0, 0)

  return submittedDateTime.toISOString()
}

export function SimulatorControls({ onTransactionSubmitted }: SimulatorControlsProps) {
  const [selectedRegion, setSelectedRegion] = useState<Region>('France')
  const [hour, setHour] = useState(DEFAULT_HOUR)
  const [minute, setMinute] = useState(DEFAULT_MINUTE)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleCancel = () => {
    setHour(DEFAULT_HOUR)
    setMinute(DEFAULT_MINUTE)
    setSubmitError(null)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await submitTransaction({
        region: selectedRegion,
        submittedDateTime: buildSubmittedDateTime(hour, minute),
      })

      onTransactionSubmitted()
    } catch (error) {
      setSubmitError(getErrorMessage(error, 'Unable to submit transaction.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="simulator-controls">
      <TimezoneSelect selectedRegion={selectedRegion} onRegionChange={setSelectedRegion} />
      <TimePickerCard
        hour={hour}
        minute={minute}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onHourChange={setHour}
        onMinuteChange={setMinute}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
