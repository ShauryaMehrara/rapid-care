import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import './Family.css'

const relations = ['Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister', 'Grandfather', 'Grandmother', 'Other']
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Not sure']
const empty = { full_name: '', relation: '', age: '', gender: '', blood_group: '', phone: '', notes: '' }

export default function Family() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null | 'new' | member id
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    supabase
      .from('family_members')
      .select('*')
      .order('created_at')
      .then(({ data, error }) => {
        if (!active) return
        if (error) setError(error.message)
        else setMembers(data)
        setLoading(false)
      })
    return () => { active = false }
  }, [])

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const openNew = () => {
    setForm(empty)
    setError('')
    setEditing('new')
  }

  const openEdit = (m) => {
    setForm({
      full_name: m.full_name || '',
      relation: m.relation || '',
      age: m.age ?? '',
      gender: m.gender || '',
      blood_group: m.blood_group || '',
      phone: m.phone || '',
      notes: m.notes || '',
    })
    setError('')
    setEditing(m.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancel = () => { setEditing(null); setError('') }

  const save = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    const payload = {
      full_name: form.full_name.trim(),
      relation: form.relation,
      age: form.age === '' ? null : Number(form.age),
      gender: form.gender,
      blood_group: form.blood_group,
      phone: form.phone.trim(),
      notes: form.notes.trim(),
    }

    if (editing === 'new') {
      const { data, error } = await supabase.from('family_members').insert(payload).select().single()
      setSaving(false)
      if (error) return setError(error.message)
      setMembers([...members, data])
    } else {
      const { data, error } = await supabase
        .from('family_members').update(payload).eq('id', editing).select().single()
      setSaving(false)
      if (error) return setError(error.message)
      setMembers(members.map((m) => (m.id === editing ? data : m)))
    }
    setEditing(null)
  }

  const remove = async (m) => {
    if (!window.confirm(`Remove ${m.full_name} from your family profiles?`)) return
    const { error } = await supabase.from('family_members').delete().eq('id', m.id)
    if (error) return setError(error.message)
    setMembers(members.filter((x) => x.id !== m.id))
  }

  return (
    <>
      <div className="fam-head">
        <div>
          <h1>Family profiles</h1>
          <p className="lead">Add the people you book care for. You can add as many members as you need.</p>
        </div>
        {editing === null && <button className="btn" onClick={openNew}>Add member</button>}
      </div>

      {editing !== null && (
        <form className="panel fam-form" onSubmit={save}>
          <h2>{editing === 'new' ? 'Add a family member' : 'Edit family member'}</h2>
          <div className="fam-grid">
            <input className="input" name="full_name" placeholder="Full name" required
              value={form.full_name} onChange={update} />
            <select className="input" name="relation" required value={form.relation} onChange={update}>
              <option value="">Relation to you</option>
              {relations.map((r) => <option key={r}>{r}</option>)}
            </select>
            <input className="input" name="age" type="number" min="0" max="120" placeholder="Age" required
              value={form.age} onChange={update} />
            <select className="input" name="gender" required value={form.gender} onChange={update}>
              <option value="">Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <select className="input" name="blood_group" value={form.blood_group} onChange={update}>
              <option value="">Blood group (optional)</option>
              {bloodGroups.map((b) => <option key={b}>{b}</option>)}
            </select>
            <input className="input" name="phone" placeholder="Phone (optional)"
              pattern="[0-9]{10}" title="Enter a 10 digit phone number"
              value={form.phone} onChange={update} />
          </div>
          <textarea className="input" name="notes" rows="2" placeholder="Notes for the care team (optional)"
            value={form.notes} onChange={update} />
          {error && <p className="error">{error}</p>}
          <div className="fam-actions">
            <button className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save member'}</button>
            <button type="button" className="btn outline" onClick={cancel}>Cancel</button>
          </div>
        </form>
      )}

      {editing === null && error && <p className="error">{error}</p>}

      {loading ? (
        <p className="lead">Loading your family...</p>
      ) : members.length === 0 ? (
        <div className="list">
          <div className="empty">No family members yet. Add the people whose tests and visits you book for.</div>
        </div>
      ) : (
        <div className="fam-cards">
          {members.map((m) => (
            <div className="fam-card" key={m.id}>
              <div className="fam-top">
                <div className="avatar">{m.full_name.trim().charAt(0).toUpperCase()}</div>
                <div>
                  <div className="row-name">{m.full_name}</div>
                  <div className="row-sub">{m.relation}</div>
                </div>
              </div>
              <div className="fam-facts">
                {m.age != null && <span className="chip">{m.age} years</span>}
                {m.gender && <span className="chip">{m.gender}</span>}
                {m.blood_group && <span className="chip blood">{m.blood_group}</span>}
              </div>
              {m.phone && <div className="row-sub">Phone: {m.phone}</div>}
              {m.notes && <div className="row-sub">{m.notes}</div>}
              <div className="fam-actions">
                <button className="btn outline small" onClick={() => openEdit(m)}>Edit</button>
                <button className="remove" onClick={() => remove(m)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
