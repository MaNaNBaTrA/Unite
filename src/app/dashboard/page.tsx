import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import LogoutButton from './logout-button'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
    error
  } = await supabase.auth.getUser()

  if (error || !user) redirect('/signin')

  return (
    <div style={{ padding: '2rem', background: '#e0f7fa', borderRadius: '10px', maxWidth: '600px', margin: '2rem auto', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#00796b' }}>👋 Welcome, {user.email}!</h1>
      <p style={{ marginTop: '1rem', fontSize: '1rem', color: '#555' }}>Your unique user ID:</p>
      <code style={{ display: 'block', padding: '0.5rem', background: '#ffffff', border: '1px solid #ccc', borderRadius: '5px', marginTop: '0.5rem', fontFamily: 'monospace' }}>{user.id}</code>
      <div style={{ marginTop: '2rem' }}>
        <LogoutButton />
      </div>
    </div>
  )
}