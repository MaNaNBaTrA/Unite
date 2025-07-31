'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/authContext'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export default function AuthGuard({ 
  children, 
  requireAuth = false, 
  redirectTo = '/' 
}: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.replace('/signin')
      } else if (!requireAuth && user) {
        router.replace(redirectTo)
      }
    }
  }, [user, loading, requireAuth, redirectTo, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <span className="loading loading-spinner loading-lg"></span>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (requireAuth && !user) {
    return null
  }

  if (!requireAuth && user) {
    return null
  }

  return <>{children}</>
}