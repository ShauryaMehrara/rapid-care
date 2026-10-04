import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import '../pages/Services.css'

// One reusable form used by the Ambulance and Cremation tabs.
export default function RequestForm({
  type, title, lead, banner, bannerTone, fields, submitLabel,
  successTitle, successText, urgent, familyField,
}) {
  const initial = Object.fromEntries(fields.map((f) => [f.name, f.default ?? '']))
  const [values, setValues] = useState(initial)
  const [family, setFamily] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [doneId, setDoneId] = useState(null)

  useEffect(() => {
    if (!familyField) return
    let active = true
    supabase
      .from('family_members')
      .select('id, full_name')
      .order('created_at')
      .then(({ data }) => { if (active && data) setFamily(data) })
    return () => { active = false }
  }, [familyField])

  const set = (name, val) => setValues((v) => ({ ...v, [name]: val }))
  const onChange = (e) => set(e.target.name, e.target.value)
  const visible = (f) => !f.showIf || values[f.showIf.field] === f.showIf.equals

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const details = {}
    fields.filter(visible).forEach((f) => { details[f.name] = values[f.name] })
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('service_requests')
      .insert({ user_id: user.id, type, details })
      .select('id')
      .single()
    setLoading(false)
    if (error) return setError(error.message)
    setDoneId(data.id)
  }

  if (doneId) {
    return (
      <div className="panel success">
        <h1>{successTitle}</h1>
        <p className="lead">
          Request ID <b>{doneId.slice(0, 8).toUpperCase()}</b>. {successText}
          {values.phone && <> We will call you on <b>{values.phone}</b>.</>}
        </p>
        <button className="btn outline" onClick={() => { setValues(initial); setDoneId(null) }}>
          Make another request
        </button>
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
            {f.name === familyField && family.length > 0 && (
              <div className="quick">
                <span className="quick-label">Fill from family:</span>
                {family.map((m) => (
                  <button type="button" className="chip-btn" key={m.id}
                    onClick={() => set(f.name, m.full_name)}>
                    {m.full_name}
                  </button>
                ))}
              </div>
            )}
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
        {error && <p className="error">{error}</p>}
        <button className={'btn full' + (urgent ? ' urgent' : '')} disabled={loading}>
          {loading ? 'Sending...' : submitLabel}
        </button>
      </form>
    </>
  )
}
