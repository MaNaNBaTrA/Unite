'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/signin')
  }

  return <button onClick={handleLogout} style={{ padding: '10px', background: '#d9534f', color: 'white', border: 'none', borderRadius: '5px' }}>Logout</button>
}