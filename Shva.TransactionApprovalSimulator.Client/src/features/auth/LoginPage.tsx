import { useState, type FormEvent } from 'react'
import { login, type LoginRequest } from '../../api/authApi'
import { ShvaLogo } from '../layout/ShvaLogo'

interface LoginPageProps {
  onLogin: (token: string) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [credentials, setCredentials] = useState<LoginRequest>({ username: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await login(credentials)
      onLogin(response.token)
    } catch {
      setError('Invalid username or password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <ShvaLogo />
        <div>
          <p className="login-eyebrow">Transaction Approval Simulator</p>
          <h1 id="login-title">Sign in to continue</h1>
          <p className="login-hint">Use admin / admin for this demo.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Username
            <input
              autoComplete="username"
              value={credentials.username}
              onChange={(event) =>
                setCredentials((current) => ({ ...current, username: event.target.value }))
              }
            />
          </label>

          <label>
            Password
            <input
              autoComplete="current-password"
              type="password"
              value={credentials.password}
              onChange={(event) =>
                setCredentials((current) => ({ ...current, password: event.target.value }))
              }
            />
          </label>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  )
}
