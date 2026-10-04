import { useEffect, useState } from 'react'
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useCart } from '../context/CartContext'

const tabs = [
  { to: '/tests', label: 'Medical Tests' },
  { to: '/ambulance', label: 'Ambulance' },
  { to: '/cremation', label: 'Cremation Transport' },
  { to: '/doctors', label: 'Doctor Consultation' },
  { to: '/family', label: 'Family Profiles' },
]

export default function Layout() {
  const [firstName, setFirstName] = useState('')
  const { items } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      const { data: p } = await supabase
        .from('profiles').select('first_name').eq('id', data.user.id).single()
      if (p) setFirstName(p.first_name || '')
    })
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/tests" className="brand">Rapid Care</Link>
          <nav className="tabs">
            {tabs.map((t) => (
              <NavLink key={t.to} to={t.to} className={({ isActive }) => 'tab' + (isActive ? ' active' : '')}>
                {t.label}
              </NavLink>
            ))}
          </nav>
          <div className="top-actions">
            <Link to="/cart" className="cart-link">
              Cart{items.length > 0 && <span className="badge">{items.length}</span>}
            </Link>
            <span className="hello">{firstName ? `Hi, ${firstName}` : ''}</span>
            <button className="btn outline small" onClick={logout}>Log out</button>
          </div>
        </div>
      </header>
      <main className="page">
        <Outlet />
      </main>
    </>
  )
}
