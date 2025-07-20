'use client'

import { supabase } from '@/lib/supabase/client'
import { useState } from 'react'
import Link from 'next/link'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Password validation conditions
  const passwordChecks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }

  const allPasswordChecksPass = Object.values(passwordChecks).every(check => check)

  const handleSignUp = async () => {
    if (!email || !password) {
      alert('Please fill in all fields.')
      return
    }

    if (!allPasswordChecksPass) {
      alert('Please ensure your password meets all requirements.')
      return
    }

    setIsLoading(true)

    try {
      console.log('Attempting signup for:', email)

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      console.log('Signup response:', { data, error })

      if (error) {
        console.error('Signup error details:', error)
        
        // Handle specific Supabase error codes
        if (error.status === 422 || error.message.includes('already registered')) {
          alert('An account with this email already exists. Please sign in instead.')
        } else if (error.message.includes('Invalid email')) {
          alert('Please enter a valid email address.')
        } else if (error.message.includes('Password should be at least')) {
          alert('Password does not meet minimum requirements.')
        } else if (error.message.includes('Signup is disabled')) {
          alert('Account registration is currently disabled. Please contact support.')
        } else {
          alert(`Signup failed: ${error.message}`)
        }
      } else {
        console.log('Signup successful:', data)
        
        // Check the response data
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          alert('An account with this email already exists. Please sign in instead.')
        } else if (data.user) {
          alert(`Success! Please check your email (${email}) for a verification link. Don't forget to check your spam folder!`)
          setEmail('')
          setPassword('')
        } else {
          alert('Account created! Please check your email for verification.')
          setEmail('')
          setPassword('')
        }
      }
    } catch (err) {
      console.error('Unexpected error during signup:', err)
      alert('Network error occurred. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const CheckIcon = ({ passed }:{passed:boolean}) => (
    <span style={{ 
      color: passed ? '#4caf50' : '#ccc', 
      marginRight: '8px',
      fontWeight: 'bold'
    }}>
      {passed ? '✓' : '○'}
    </span>
  )

  return (
    <div style={{ 
      padding: '2rem', 
      background: '#f0f4f8', 
      borderRadius: '10px', 
      maxWidth: '450px', 
      margin: '2rem auto', 
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      fontFamily: 'sans-serif'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Sign Up</h2>
      
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        style={{ 
          padding: '12px', 
          width: '100%', 
          border: '1px solid #ddd',
          borderRadius: '5px',
          fontSize: '14px',
          marginBottom: '1rem',
          boxSizing: 'border-box'
        }} 
      />
      
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        style={{ 
          padding: '12px', 
          width: '100%', 
          border: '1px solid #ddd',
          borderRadius: '5px',
          fontSize: '14px',
          marginBottom: '1rem',
          boxSizing: 'border-box'
        }} 
      />

      {/* Password Requirements */}
      <div style={{ 
        background: '#fff', 
        padding: '1rem', 
        borderRadius: '5px', 
        border: '1px solid #e0e0e0',
        marginBottom: '1rem'
      }}>
        <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#555', fontSize: '14px' }}>
          Password Requirements:
        </p>
        <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
          <div><CheckIcon passed={passwordChecks.length} />At least 8 characters</div>
          <div><CheckIcon passed={passwordChecks.lowercase} />Contains lowercase letter</div>
          <div><CheckIcon passed={passwordChecks.uppercase} />Contains uppercase letter</div>
          <div><CheckIcon passed={passwordChecks.number} />Contains number</div>
          <div><CheckIcon passed={passwordChecks.symbol} />Contains symbol (!@#$%^&*etc.)</div>
        </div>
      </div>
      
      <button 
        onClick={handleSignUp}
        disabled={isLoading || !allPasswordChecksPass || !email}
        style={{ 
          padding: '12px', 
          width: '100%', 
          backgroundColor: isLoading || !allPasswordChecksPass || !email ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: isLoading || !allPasswordChecksPass || !email ? 'not-allowed' : 'pointer',
          marginBottom: '1rem'
        }}
      >
        {isLoading ? 'Signing Up...' : 'Sign Up'}
      </button>
      
      <div style={{ textAlign: 'center' }}>
        <Link href="/signin" style={{ color: '#007bff', textDecoration: 'none' }}>
          Already have an account? Sign In
        </Link>
        <br />
        <Link href="/" style={{ color: '#007bff', textDecoration: 'none', marginTop: '0.5rem', display: 'inline-block' }}>
          Back to Home
        </Link>
      </div>
    </div>
  )
}