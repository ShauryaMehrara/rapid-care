import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import Ecg from '../components/Ecg'

export default function Auth({ mode }) {
  const isRegister = mode === 'register'
  const navigate = useNavigate()
  const [step, setStep] = useState('form')
  const [form, setForm] = useState({
    first_name: '', last_name: '', age: '', gender: '', email: '',
  })
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const sendOtp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email: form.email.trim(),
      options: isRegister
        ? {
            shouldCreateUser: true,
            data: {
              first_name: form.first_name.trim(),
              last_name: form.last_name.trim(),
              age: form.age,
              gender: form.gender,
            },
          }
        : { shouldCreateUser: false },
    })
    setLoading(false)
    if (error) return setError(error.message)
    setStep('otp')
  }

  const verifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({
      email: form.email.trim(),
      token: otp.trim(),
      type: 'email',
    })
    setLoading(false)
    if (error) return setError(error.message)
    navigate('/home')
  }

  return (
    <div className="auth-shell">
      <aside className="auth-brand">
        <div className="auth-logo"><span className="logo">+</span> Rapid Care</div>
        <div>
          <h2>Care for your whole family, in one place.</h2>
          <ul className="auth-points">
            <li>Book lab tests with home sample collection</li>
            <li>Request an ambulance in under a minute</li>
            <li>Consult a doctor on video or at the clinic</li>
          </ul>
        </div>
        <Ecg />
      </aside>

      <main className="auth-main">
        <div className="card">
          <h1 className="auth-title">{isRegister ? 'Create your account' : 'Welcome back'}</h1>
          <p className="sub">
            {isRegister
              ? 'Register with your email. We will send you a verification code.'
              : 'Log in with your email. We will send you a code.'}
          </p>

          {step === 'form' ? (
            <form onSubmit={sendOtp} className="step-in" key="form">
              {isRegister && (
                <>
                  <div className="two">
                    <input name="first_name" placeholder="First name" required
                      value={form.first_name} onChange={update} />
                    <input name="last_name" placeholder="Last name" required
                      value={form.last_name} onChange={update} />
                  </div>
                  <div className="two">
                    <input name="age" type="number" min="1" max="120" placeholder="Age" required
                      value={form.age} onChange={update} />
                    <select name="gender" required value={form.gender} onChange={update}>
                      <option value="">Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </>
              )}
              <input name="email" type="email" placeholder="Email id" required
                value={form.email} onChange={update} />
              <button disabled={loading}>{loading ? 'Sending code...' : 'Next'}</button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="step-in" key="otp">
              <p>We sent a code to <b>{form.email}</b></p>
              <input placeholder="Enter verification code" required inputMode="numeric"
                autoComplete="one-time-code" value={otp} onChange={(e) => setOtp(e.target.value)} />
              <button disabled={loading}>{loading ? 'Verifying...' : 'Verify and continue'}</button>
              <button type="button" className="link" onClick={() => setStep('form')}>
                Change email
              </button>
            </form>
          )}

          {error && <p className="error">{error}</p>}

          <p className="switch">
            {isRegister ? (
              <>Already registered? <Link to="/login">Log in</Link></>
            ) : (
              <>New here? <Link to="/register">Create account</Link></>
            )}
          </p>
        </div>
      </main>
    </div>
  )
}
