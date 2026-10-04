import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

// Returns the people a service can be booked for: the user and their saved family members.
export default function usePatients() {
  const [options, setOptions] = useState([])

  useEffect(() => {
    let active = true
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const [profile, family] = await Promise.all([
        supabase.from('profiles').select('first_name, last_name').eq('id', user.id).single(),
        supabase.from('family_members').select('id, full_name, relation').order('created_at'),
      ])
      if (!active) return
      const full = [profile.data?.first_name, profile.data?.last_name].filter(Boolean).join(' ')
      const list = [{ value: 'self', label: full ? `Myself (${full})` : 'Myself', name: full || 'Myself' }]
      ;(family.data || []).forEach((m) =>
        list.push({
          value: m.id,
          label: m.relation ? `${m.full_name} (${m.relation})` : m.full_name,
          name: m.full_name,
        })
      )
      setOptions(list)
    })()
    return () => { active = false }
  }, [])

  return options
}