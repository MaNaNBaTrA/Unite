import AuthGuard from '@/helpers/authGuard'
import SignUpForm from './SignUpForm'

export default function SignUpPage() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/">
        <SignUpForm />
    </AuthGuard>
  )
}
