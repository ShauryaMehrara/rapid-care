import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Dashboard() {
  const [profile, setProfile] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const { data: p } = await supabase
        .from('profiles').select('*').eq('id', data.user.id).single()
      setProfile(p)
    })
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="card">
      <h1>Hello{profile ? `, ${profile.first_name}` : ''} 👋</h1>
      <p>You are logged in. The service tabs come next.</p>
      <button onClick={logout}>Log out</button>
    </div>
  )
}
