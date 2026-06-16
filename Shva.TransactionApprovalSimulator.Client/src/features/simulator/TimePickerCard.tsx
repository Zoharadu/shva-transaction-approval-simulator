export function TimePickerCard() {
  return (
    <div className="time-picker-card" aria-label="Time picker">
      <div className="time-fields">
        <div className="time-unit">
          <div className="time-box active">20</div>
          <span>Hour</span>
        </div>
        <span className="time-separator">:</span>
        <div className="time-unit">
          <div className="time-box">00</div>
          <span>Minute</span>
        </div>
      </div>
      <div className="time-actions">
        <button type="button">Cancel</button>
        <button type="button">OK</button>
      </div>
    </div>
  )
}
