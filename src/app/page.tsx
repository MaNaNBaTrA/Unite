import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌟 Welcome to Auth Demo 🌟</h1>
      <Link href="/signin" style={{ marginRight: '1rem', padding: '10px', background: '#0070f3', color: 'white', borderRadius: '5px' }}>Sign In</Link>
      <Link href="/signup" style={{ padding: '10px', background: '#28a745', color: 'white', borderRadius: '5px' }}>Sign Up</Link>
    </div>
  )
}