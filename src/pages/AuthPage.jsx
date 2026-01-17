import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { clearAuthError, signInWithEmail, signUpWithEmail } from '../features/auth/authSlice'

function AuthPage() {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const status = useSelector((state) => state.auth.status)
  const error = useSelector((state) => state.auth.error)
  const user = useSelector((state) => state.auth.user)

  const isLoading = status === 'loading'

  async function handleSubmit(event) {
    event.preventDefault()
    if (!email || !password) {
      toast.error('Please enter email and password')
      return
    }
    dispatch(clearAuthError())
    try {
      if (mode === 'signin') {
        const result = await dispatch(signInWithEmail({ email, password }))
        if (signInWithEmail.fulfilled.match(result)) {
          toast.success('Signed in successfully')
          navigate('/profile')
        } else if (result.payload) {
          toast.error(result.payload)
        }
      } else {
        const result = await dispatch(signUpWithEmail({ email, password }))
        if (signUpWithEmail.fulfilled.match(result)) {
          toast.success('Account created')
          navigate('/profile')
        } else if (result.payload) {
          toast.error(result.payload)
        }
      }
    } catch {
      toast.error('Authentication failed')
    }
  }

  return (
    <div className="auth-page">
      <Card
        title={
          user
            ? 'You are signed in'
            : mode === 'signin'
            ? 'Sign in to download and share invitations'
            : 'Create an account to save invitations'
        }
        subtitle="Guests can upload and preview without an account"
      >
        <div className="auth-toggle">
          <button
            type="button"
            className={`auth-toggle-tab ${mode === 'signin' ? 'is-active' : ''}`}
            onClick={() => setMode('signin')}
          >
            Sign in
          </button>
          <button
            type="button"
            className={`auth-toggle-tab ${mode === 'signup' ? 'is-active' : ''}`}
            onClick={() => setMode('signup')}
          >
            Sign up
          </button>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <Input
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="Enter a secure password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error && <p className="auth-error">{error}</p>}
          <Button type="submit" fullWidth isLoading={isLoading}>
            {mode === 'signin' ? 'Continue' : 'Create account'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default AuthPage
