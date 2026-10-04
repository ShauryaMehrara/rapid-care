import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './PatientModal.css'

// Popup shown at checkout asking who the booking is for.
export default function PatientModal({
  options, busy, error, onCancel, onConfirm,
  title = 'Who is this booking for?', confirmLabel = 'Confirm booking',
}) {
  const [choice, setChoice] = useState('')
  const [other, setOther] = useState('')

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && !busy) onCancel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [busy, onCancel])

  const name = choice === 'other' ? other.trim() : options.find((o) => o.value === choice)?.name || ''

  return (
    <div className="modal-back" onClick={() => { if (!busy) onCancel() }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}
        onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p className="row-sub">Choose the person this booking is for.</p>

        <div className="who-list">
          {options.map((o) => (
            <label key={o.value} className={'who' + (choice === o.value ? ' on' : '')}>
              <input type="radio" name="who" value={o.value}
                checked={choice === o.value} onChange={() => setChoice(o.value)} />
              <span>{o.label}</span>
            </label>
          ))}
          <label className={'who' + (choice === 'other' ? ' on' : '')}>
            <input type="radio" name="who" value="other"
              checked={choice === 'other'} onChange={() => setChoice('other')} />
            <span>Someone else</span>
          </label>
        </div>

        {choice === 'other' && (
          <input className="input" autoFocus placeholder="Full name of the person"
            value={other} onChange={(e) => setOther(e.target.value)} />
        )}

        {options.length <= 1 && (
          <p className="note">
            To book for a family member, add them in <Link to="/family">Family Profiles</Link> first.
          </p>
        )}

        {error && <p className="error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="btn outline" onClick={onCancel} disabled={busy}>Cancel</button>
          <button type="button" className="btn" disabled={!name || busy} onClick={() => onConfirm(name)}>
            {busy ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
