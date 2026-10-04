import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => setSession(s)
    )
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) return <p className="center">Loading...</p>
  return session ? children : <Navigate to="/login" replace />
}
