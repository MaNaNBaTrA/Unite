'use client'
import { supabase } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'password' | 'magic'>('password')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLoginWithPassword = async () => {
    if (!email || !password) {
      alert('Please fill in all fields.')
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (error) {
        console.error('Sign in error:', error)
        
        // Handle specific error types
        if (error.message.includes('Invalid login credentials') || 
            error.message.includes('Email not confirmed') ||
            error.message.includes('Invalid email or password')) {
          alert('Invalid email or password. Please check your credentials.')
        } else if (error.message.includes('Email not confirmed')) {
          alert('Please verify your email address before signing in. Check your inbox for a verification link.')
        } else if (error.message.includes('Too many requests')) {
          alert('Too many login attempts. Please wait a few minutes before trying again.')
        } else if (error.message.includes('User not found')) {
          alert('No account found with this email address. Please sign up first.')
        } else if (error.message.includes('Invalid email')) {
          alert('Please enter a valid email address.')
        } else {
          alert(`Sign in failed: ${error.message}`)
        }
      } else if (data.user) {
        // Success
        router.push('/dashboard')
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      alert('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginWithMagic = async () => {
    if (!email) {
      alert('Please enter your email address.')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error('Magic link error:', error)
        
        if (error.message.includes('Invalid email')) {
          alert('Please enter a valid email address.')
        } else if (error.message.includes('Too many requests')) {
          alert('Too many requests. Please wait before requesting another magic link.')
        } else if (error.message.includes('rate limit')) {
          alert('Please wait before requesting another magic link.')
        } else {
          alert(`Failed to send magic link: ${error.message}`)
        }
      } else {
        alert('Check your email for the login link. Don\'t forget to check spam folder!')
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      alert('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error('Google sign in error:', error)
        alert(`Google sign in failed: ${error.message}`)
      }
      // Note: Success will redirect, so no need to handle success case
    } catch (err) {
      console.error('Unexpected error:', err)
      alert('Failed to sign in with Google. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ 
      padding: '2rem', 
      background: '#f7f7f7', 
      borderRadius: '10px', 
      maxWidth: '450px', 
      margin: '2rem auto', 
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      fontFamily: 'sans-serif'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Sign In</h2>
      
      {/* Mode Toggle */}
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <button 
          onClick={() => setMode('password')}
          disabled={isLoading}
          style={{ 
            marginRight: '0.5rem', 
            padding: '8px 16px',
            background: mode === 'password' ? '#0070f3' : '#ddd', 
            color: mode === 'password' ? 'white' : 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          With Password
        </button>
        <button 
          onClick={() => setMode('magic')}
          disabled={isLoading}
          style={{ 
            padding: '8px 16px',
            background: mode === 'magic' ? '#0070f3' : '#ddd', 
            color: mode === 'magic' ? 'white' : 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          Magic Link
        </button>
      </div>

      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        style={{ 
          padding: '12px', 
          width: '100%', 
          border: '1px solid #ddd',
          borderRadius: '5px',
          fontSize: '14px',
          marginBottom: '1rem',
          boxSizing: 'border-box',
          opacity: isLoading ? 0.7 : 1
        }} 
      />

      {/* Password Input (only for password mode) */}
      {mode === 'password' && (
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          style={{ 
            padding: '12px', 
            width: '100%', 
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '14px',
            marginBottom: '1rem',
            boxSizing: 'border-box',
            opacity: isLoading ? 0.7 : 1
          }} 
        />
      )}

      {/* Sign In Button */}
      <button 
        onClick={mode === 'password' ? handleLoginWithPassword : handleLoginWithMagic}
        disabled={isLoading || !email || (mode === 'password' && !password)}
        style={{ 
          padding: '12px', 
          width: '100%', 
          marginBottom: '10px',
          backgroundColor: isLoading || !email || (mode === 'password' && !password) ? '#ccc' : '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: isLoading || !email || (mode === 'password' && !password) ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Signing In...' : (mode === 'password' ? 'Sign In with Password' : 'Send Magic Link')}
      </button>

      {/* Google Login Button */}
      <button 
        onClick={handleGoogleLogin}
        disabled={isLoading}
        style={{ 
          padding: '12px', 
          width: '100%',
          backgroundColor: isLoading ? '#ccc' : '#db4437',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          marginBottom: '1rem'
        }}
      >
        {isLoading ? 'Loading...' : 'Sign In with Google'}
      </button>

      {/* Links */}
      <div style={{ textAlign: 'center' }}>
        <Link href="/signup" style={{ color: '#0070f3', textDecoration: 'none' }}>
          Don't have an account? Sign Up
        </Link>
        <br />
        <Link href="/" style={{ color: '#0070f3', textDecoration: 'none', marginTop: '0.5rem', display: 'inline-block' }}>
          Back to Home
        </Link>
      </div>
    </div>
  )
}