import { useState } from 'react'
import { supabase } from '../supabaseClient'
import PatientModal from './PatientModal'
import usePatients from '../hooks/usePatients'
import '../pages/Services.css'

// One reusable form used by the Ambulance and Cremation tabs.
// With askPatient, a popup asks who the request is for before it is sent.
export default function RequestForm({
  type, title, lead, banner, bannerTone, fields, submitLabel,
  successTitle, successText, urgent, askPatient,
}) {
  const initial = Object.fromEntries(fields.map((f) => [f.name, f.default ?? '']))
  const [values, setValues] = useState(initial)
  const patients = usePatients()
  const [askWho, setAskWho] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [doneId, setDoneId] = useState(null)

  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
  const visible = (f) => !f.showIf || values[f.showIf.field] === f.showIf.equals

  const send = async (patientName) => {
    setError('')
    setLoading(true)
    const details = {}
    fields.filter(visible).forEach((f) => { details[f.name] = values[f.name] })
    if (patientName) details.patient_name = patientName
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('service_requests')
      .insert({ user_id: user.id, type, details })
      .select('id')
      .single()
    setLoading(false)
    if (error) return setError(error.message)
    setAskWho(false)
    setDoneId(data.id)
  }

  const submit = (e) => {
    e.preventDefault()
    setError('')
    if (askPatient) setAskWho(true)
    else send(null)
  }

  const reset = () => { setValues(initial); setDoneId(null) }

  if (doneId) {
    return (
      <div className="panel success">
        <h1>{successTitle}</h1>
        <p className="lead">
          Request ID <b>{doneId.slice(0, 8).toUpperCase()}</b>. {successText}
          {values.phone && <> We will call you on <b>{values.phone}</b>.</>}
        </p>
        <button className="btn outline" onClick={reset}>Make another request</button>
      </div>
    )
  }

  return (
    <>
      <h1>{title}</h1>
      <p className="lead">{lead}</p>
      {banner && <div className={'banner ' + (bannerTone || 'soft')}>{banner}</div>}

      <form className="panel req-form" onSubmit={submit}>
        {fields.filter(visible).map((f) => (
          <label className="fld" key={f.name}>
            <span>{f.label}</span>
            {f.type === 'select' ? (
              <select className="input" name={f.name} value={values[f.name]}
                required={f.required} onChange={onChange}>
                {f.options.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea className="input" name={f.name} rows="3" value={values[f.name]}
                required={f.required} placeholder={f.placeholder} onChange={onChange} />
            ) : (
              <input className="input" name={f.name} type={f.type || 'text'}
                value={values[f.name]} required={f.required} placeholder={f.placeholder}
                pattern={f.pattern} title={f.title} onChange={onChange} />
            )}
          </label>
        ))}
        {!askWho && error && <p className="error">{error}</p>}
        <button className={'btn full' + (urgent ? ' urgent' : '')} disabled={loading}>
          {loading ? 'Sending...' : submitLabel}
        </button>
      </form>

      {askWho && (
        <PatientModal
          options={patients}
          busy={loading}
          error={error}
          title="Who needs this service?"
          confirmLabel={submitLabel}
          onCancel={() => { setAskWho(false); setError('') }}
          onConfirm={send}
        />
      )}
    </>
  )
}
