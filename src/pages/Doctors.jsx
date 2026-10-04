import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { doctors, specialties } from '../data/doctors'
import { rupees } from '../data/tests'
import './Services.css'

const slots = ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM', '6:00 PM']
const today = new Date().toISOString().split('T')[0]
const emptyForm = { mode: 'Video call', slot_date: '', slot_time: slots[0], patient: '', patient_other: '', reason: '' }

export default function Doctors() {
  const [specialty, setSpecialty] = useState('All')
  const [query, setQuery] = useState('')
  const [booking, setBooking] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [family, setFamily] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(null)

  useEffect(() => {
    let active = true
    supabase
      .from('family_members')
      .select('id, full_name')
      .order('created_at')
      .then(({ data }) => { if (active && data) setFamily(data) })
    return () => { active = false }
  }, [])

  const q = query.trim().toLowerCase()
  const shown = doctors.filter(
    (d) =>
      (specialty === 'All' || d.specialty === specialty) &&
      (!q || d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q))
  )

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const openBooking = (d) => {
    setBooking(d)
    setForm(emptyForm)
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const confirm = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const patient_name = form.patient === 'Someone else' ? form.patient_other.trim() : form.patient
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        user_id: user.id,
        doctor_name: booking.name,
        specialty: booking.specialty,
        mode: form.mode,
        slot_date: form.slot_date,
        slot_time: form.slot_time,
        patient_name,
        reason: form.reason.trim(),
        fee: booking.fee,
      })
      .select('id')
      .single()
    setLoading(false)
    if (error) return setError(error.message)
    setDone({ id: data.id, doctor: booking.name, date: form.slot_date, time: form.slot_time, mode: form.mode, patient: patient_name })
    setBooking(null)
  }

  if (done) {
    return (
      <div className="panel success">
        <h1>Appointment booked</h1>
        <p className="lead">
          {done.mode} with <b>{done.doctor}</b> for {done.patient} on {done.date} at {done.time}.
          Booking ID <b>{done.id.slice(0, 8).toUpperCase()}</b>.
        </p>
        <button className="btn outline" onClick={() => setDone(null)}>Back to doctors</button>
      </div>
    )
  }

  return (
    <>
      <h1>Doctor consultation</h1>
      <p className="lead">Find a doctor by name or specialty and book a video call or clinic visit.</p>

      {booking && (
        <form className="panel req-form booking" onSubmit={confirm}>
          <h2>Book {booking.name}</h2>
          <p className="row-sub">{booking.specialty}, consultation fee {rupees(booking.fee)}</p>

          <label className="fld"><span>Consultation type</span>
            <select className="input" name="mode" value={form.mode} onChange={update}>
              <option>Video call</option>
              <option>Clinic visit</option>
            </select>
          </label>
          <div className="two">
            <label className="fld"><span>Date</span>
              <input className="input" type="date" name="slot_date" min={today} required
                value={form.slot_date} onChange={update} />
            </label>
            <label className="fld"><span>Time slot</span>
              <select className="input" name="slot_time" value={form.slot_time} onChange={update}>
                {slots.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
          </div>
          <label className="fld"><span>Who is the patient?</span>
            <select className="input" name="patient" required value={form.patient} onChange={update}>
              <option value="">Select patient</option>
              <option>Myself</option>
              {family.map((m) => <option key={m.id}>{m.full_name}</option>)}
              <option>Someone else</option>
            </select>
          </label>
          {form.patient === 'Someone else' && (
            <label className="fld"><span>Patient name</span>
              <input className="input" name="patient_other" required
                value={form.patient_other} onChange={update} />
            </label>
          )}
          <label className="fld"><span>Reason for visit (optional)</span>
            <textarea className="input" name="reason" rows="2" value={form.reason} onChange={update} />
          </label>
          {error && <p className="error">{error}</p>}
          <div className="fam-actions">
            <button className="btn" disabled={loading}>{loading ? 'Booking...' : 'Confirm appointment'}</button>
            <button type="button" className="btn outline" onClick={() => setBooking(null)}>Cancel</button>
          </div>
        </form>
      )}

      <input className="input search" placeholder="Search a doctor or specialty"
        value={query} onChange={(e) => setQuery(e.target.value)} />

      <div className="chips">
        {['All', ...specialties].map((s) => (
          <button key={s} className={'chip-btn' + (specialty === s ? ' on' : '')}
            onClick={() => setSpecialty(s)}>{s}</button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="list"><div className="empty">No doctor matches your search. Try another specialty.</div></div>
      ) : (
        <div className="doc-cards">
          {shown.map((d) => (
            <div className="doc-card" key={d.id}>
              <div className="fam-top">
                <div className="avatar">{d.name.replace('Dr. ', '').charAt(0)}</div>
                <div>
                  <div className="row-name">{d.name}</div>
                  <div className="row-sub">{d.specialty}</div>
                </div>
              </div>
              <div className="row-sub">{d.qualification}</div>
              <div className="row-sub">{d.exp} years of experience. Speaks {d.languages}.</div>
              <div className="pkg-foot">
                <span className="price">{rupees(d.fee)}</span>
                <button className="btn small" onClick={() => openBooking(d)}>Book</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="note demo-note">Doctors shown here are sample listings for the prototype.</p>
    </>
  )
}
