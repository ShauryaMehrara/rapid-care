import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useCart } from '../context/CartContext'
import { rupees } from '../data/tests'

const slots = ['7 AM - 10 AM', '10 AM - 1 PM', '1 PM - 5 PM']
const today = new Date().toISOString().split('T')[0]

export default function Cart() {
  const { items, remove, clear, total } = useCart()
  const [form, setForm] = useState({
    phone: '', address: '', city: '', pincode: '',
    slot_date: '', slot_time: slots[0], payment_method: 'UPI',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState(null)

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const placeOrder = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        items: items.map(({ id, name, price, type }) => ({ id, name, price, type })),
        total,
        ...form,
      })
      .select('id')
      .single()
    setLoading(false)
    if (error) return setError(error.message)
    setOrderId(data.id)
    clear()
  }

  if (orderId) {
    return (
      <div className="panel success">
        <h1>Booking confirmed</h1>
        <p className="lead">Your booking ID is <b>{orderId.slice(0, 8).toUpperCase()}</b>. Our team will call you to confirm the sample collection slot.</p>
        <Link to="/tests" className="btn">Book more tests</Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <>
        <h1>Your cart</h1>
        <div className="list">
          <div className="empty">
            Your cart is empty. <Link to="/tests">Browse medical tests</Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <h1>Your cart</h1>
      <p className="lead">Review your tests and enter the details for sample collection.</p>
      <div className="cart-grid">
        <div className="list">
          {items.map((i) => (
            <div className="row" key={i.id}>
              <div className="row-main">
                <div className="row-name">{i.name}</div>
                <div className="row-sub">{i.type === 'package' ? 'Diagnostic package' : 'Single test'}</div>
              </div>
              <div className="price">{rupees(i.price)}</div>
              <button className="remove" onClick={() => remove(i.id)}>Remove</button>
            </div>
          ))}
        </div>

        <form className="panel" onSubmit={placeOrder}>
          <h2>Collection details</h2>
          <input className="input" name="phone" placeholder="Phone number" required
            pattern="[0-9]{10}" title="Enter a 10 digit phone number"
            value={form.phone} onChange={update} />
          <input className="input" name="address" placeholder="House no., street, area" required
            value={form.address} onChange={update} />
          <div className="two">
            <input className="input" name="city" placeholder="City" required
              value={form.city} onChange={update} />
            <input className="input" name="pincode" placeholder="Pincode" required
              pattern="[0-9]{6}" title="Enter a 6 digit pincode"
              value={form.pincode} onChange={update} />
          </div>
          <div className="two">
            <input className="input" type="date" name="slot_date" min={today} required
              value={form.slot_date} onChange={update} />
            <select className="input" name="slot_time" value={form.slot_time} onChange={update}>
              {slots.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="pay-title">Payment method</div>
          <div className="pay">
            {['UPI', 'Card', 'Pay at collection'].map((m) => (
              <label key={m}>
                <input type="radio" name="payment_method" value={m}
                  checked={form.payment_method === m} onChange={update} /> {m}
              </label>
            ))}
          </div>
          <p className="note">Demo payment: no money is charged in this prototype.</p>

          <div className="sum-row sum-total"><span>Total</span><span>{rupees(total)}</span></div>
          {error && <p className="error">{error}</p>}
          <button className="btn full" disabled={loading}>
            {loading ? 'Placing booking...' : 'Confirm booking'}
          </button>
        </form>
      </div>
    </>
  )
}
