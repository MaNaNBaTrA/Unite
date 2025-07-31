// 'use client'

// import { supabase } from '@/lib/supabase/client'
// import { useState } from 'react'
// import Link from 'next/link'

// export default function SignUpForm() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [isLoading, setIsLoading] = useState(false)

//   const passwordChecks = {
//     length: password.length >= 8,
//     lowercase: /[a-z]/.test(password),
//     uppercase: /[A-Z]/.test(password),
//     number: /\d/.test(password),
//     symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
//   }

//   const allPasswordChecksPass = Object.values(passwordChecks).every(Boolean)

//   const handleSignUp = async () => {
//     if (!email || !password) {
//       alert('Please fill in all fields.')
//       return
//     }

//     if (!allPasswordChecksPass) {
//       alert('Please ensure your password meets all requirements.')
//       return
//     }

//     setIsLoading(true)

//     try {
//       const { data, error } = await supabase.auth.signUp({
//         email: email.trim().toLowerCase(),
//         password,
//         options: {
//           emailRedirectTo: `${window.location.origin}/auth/callback`,
//         },
//       })

//       if (error) {
//         console.error('Signup error:', error.message)
//         alert(error.message)
//         return
//       }

//       if (data.user && data.user.identities?.length === 0) {
//         alert('An account with this email already exists. Please sign in instead.')
//       } else {
//         alert(`Success! Check ${email} for the verification link.`)
//         setEmail('')
//         setPassword('')
//       }

//     } catch (err: any) {
//       console.error('Unexpected error:', err)
//       alert('An unexpected error occurred. Please try again.')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const CheckIcon = ({ passed }: { passed: boolean }) => (
//     <span className={`mr-2 font-bold ${passed ? 'text-green-500' : 'text-gray-400'}`}>
//       {passed ? '✓' : '○'}
//     </span>
//   )

//   return (
//       <div className="card w-full max-w-md bg-base-100 shadow-xl">
//         <div className="card-body">
//           <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

//           <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
//             <div className="form-control">
//               <label className="label"><span className="label-text">Email</span></label>
//               <input
//                 type="email"
//                 className="input input-bordered w-full"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 disabled={isLoading}
//               />
//             </div>

//             <div className="form-control">
//               <label className="label"><span className="label-text">Password</span></label>
//               <input
//                 type="password"
//                 className="input input-bordered w-full"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 disabled={isLoading}
//               />
//             </div>

//             <div className="card bg-base-200 p-4">
//               <div className="text-sm space-y-1">
//                 <div className="flex items-center"><CheckIcon passed={passwordChecks.length} />At least 8 characters</div>
//                 <div className="flex items-center"><CheckIcon passed={passwordChecks.lowercase} />Lowercase letter</div>
//                 <div className="flex items-center"><CheckIcon passed={passwordChecks.uppercase} />Uppercase letter</div>
//                 <div className="flex items-center"><CheckIcon passed={passwordChecks.number} />Number</div>
//                 <div className="flex items-center"><CheckIcon passed={passwordChecks.symbol} />Symbol (!@#$%)</div>
//               </div>
//             </div>

//             <button
//               onClick={handleSignUp}
//               disabled={isLoading || !allPasswordChecksPass}
//               className="btn btn-primary w-full"
//             >
//               {isLoading && <span className="loading loading-spinner loading-sm"></span>}
//               {isLoading ? 'Signing Up...' : 'Sign Up'}
//             </button>
//           </form>

//           <div className="text-center space-y-2 mt-6">
//             <Link href="/signin" className="link link-primary">Already have an account? Sign In</Link><br />
//             <Link href="/" className="link link-neutral">Back to Home</Link>
//           </div>
//         </div>
//       </div>

//   )
// }
'use client'
import { ReactEventHandler, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [comment, setComment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  // Password validation checks
  const passwordChecks = {
    length: formData.password.length >= 8,
    lowercase: /[a-z]/.test(formData.password),
    uppercase: /[A-Z]/.test(formData.password),
    number: /\d/.test(formData.password),
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  }

  const allPasswordChecksPass = Object.values(passwordChecks).every(Boolean)

  // Handle input changes
  const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear errors when user starts typing
    if (error) setError('')
    if (successMessage) setSuccessMessage('')
  }

  // Email Sign Up Function
  const handleEmailSignUp = async (e : React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.')
      return
    }

    if (!allPasswordChecksPass) {
      setError('Please ensure your password meets all requirements.')
      return
    }

    setLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        console.error('Signup error:', signUpError.message)
        setError(signUpError.message)
        return
      }

      if (data.user && data.user.identities?.length === 0) {
        setError('An account with this email already exists. Please sign in instead.')
      } else {
        setSuccessMessage(`Success! Check ${formData.email} for the verification link.`)
        setFormData({ email: '', password: '' })
      }

    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Google Sign Up Function
  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      const { data, error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      })

      if (googleError) {
        console.error('Google signup error:', googleError.message)
        setError('Failed to sign up with Google. Please try again.')
        return
      }

      // OAuth redirect will handle the rest

    } catch (err) {
      console.error('Google signup error:', err)
      setError('Failed to sign up with Google. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign Up</h2>
      
      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          color: '#c33',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div style={{
          backgroundColor: '#efe',
          border: '1px solid #cfc',
          color: '#3c3',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px',
          fontSize: '14px'
        }}>
          {successMessage}
        </div>
      )}

      {/* Google Sign Up Button */}
      <button
        onClick={handleGoogleSignUp}
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#4285f4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '15px',
          opacity: loading ? 0.6 : 1
        }}
      >
        {loading ? 'Signing up...' : '🔍 Continue with Google'}
      </button>

      {/* Divider */}
      <div style={{ 
        textAlign: 'center', 
        margin: '20px 0',
        position: 'relative'
      }}>
        <span style={{
          backgroundColor: 'white',
          padding: '0 10px',
          color: '#666',
          fontSize: '14px'
        }}>
          or
        </span>
        <hr style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          zIndex: -1,
          border: 'none',
          borderTop: '1px solid #ddd'
        }} />
      </div>

      {/* Email Form */}
      <form onSubmit={handleEmailSignUp}>
        {/* Email Input */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your@email.com"
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Password Input */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            Password:
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px',
                paddingRight: '40px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="button"
              onClick={togglePassword}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        {formData.password && (
          <div style={{
            backgroundColor: '#f9f9f9',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px',
            fontSize: '13px'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              Password Requirements:
            </div>
            <div style={{ color: passwordChecks.length ? 'green' : 'red' }}>
              {passwordChecks.length ? '✅' : '❌'} At least 8 characters
            </div>
            <div style={{ color: passwordChecks.lowercase ? 'green' : 'red' }}>
              {passwordChecks.lowercase ? '✅' : '❌'} One lowercase letter
            </div>
            <div style={{ color: passwordChecks.uppercase ? 'green' : 'red' }}>
              {passwordChecks.uppercase ? '✅' : '❌'} One uppercase letter
            </div>
            <div style={{ color: passwordChecks.number ? 'green' : 'red' }}>
              {passwordChecks.number ? '✅' : '❌'} One number
            </div>
            <div style={{ color: passwordChecks.symbol ? 'green' : 'red' }}>
              {passwordChecks.symbol ? '✅' : '❌'} One special character
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !allPasswordChecksPass}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading || !allPasswordChecksPass ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading || !allPasswordChecksPass ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      {/* Sign In Link */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '20px',
        fontSize: '14px'
      }}>
        Already have an account?{' '}
        <span 
          style={{ 
            color: '#007bff', 
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
          onClick={() => console.log('Redirect to sign in')}
        >
          Sign In
        </span>
      </div>
    </div>
  )
}

export default SignUpForm
