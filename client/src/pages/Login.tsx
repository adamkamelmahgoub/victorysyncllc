
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiPost } from '../lib/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await apiPost('/auth/login', { email, password })
      navigate('/customer-dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>VictorySync Login</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              placeholder="demo@victorysync.com"
            />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              placeholder="VictoryScale123!"
            />
          </label>
        </div>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '0.75rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        Demo: demo@victorysync.com / VictoryScale123!
      </p>
    </div>
  )
}
import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/http'
import { useMe } from '../lib/auth'

export default function Login() {
  const [email, setEmail] = useState('demo@victorysync.com')
  const [password, setPassword] = useState('VictoryScale123!')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { refetch } = useMe()

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const res = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      setError('Invalid credentials')
      return
    }
    // Revalidate session & go to dashboard
    await refetch()
    navigate('/customer-dashboard')
  }

  return (
    <div style={{ maxWidth: 400, margin: '10vh auto', fontFamily: 'sans-serif' }}>
      <h2>Welcome Back</h2>
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Sign in</button>
      </form>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </div>
  )
}
