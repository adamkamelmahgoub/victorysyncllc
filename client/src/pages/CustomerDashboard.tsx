
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiGet, apiPost } from '../lib/api'

export default function CustomerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiGet('/auth/me')
        setUser(response.user || response)
      } catch (err: any) {
        if (err.message.includes('401') || err.message.includes('Unauthorized')) {
          navigate('/login')
        } else {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [navigate])

  const handleLogout = async () => {
    try {
      await apiPost('/auth/logout', {})
      navigate('/login')
    } catch (err: any) {
      console.error('Logout error:', err)
      navigate('/login')
    }
  }

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading...</div>
  }

  if (error) {
    return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Customer Dashboard</h1>
      {user && (
        <div style={{ marginBottom: '2rem' }}>
          <p>Welcome, {user.email}!</p>
          <p>Role: {user.role}</p>
          <p>Organization: {user.orgId}</p>
        </div>
      )}
      <button 
        onClick={handleLogout}
        style={{ padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Logout
      </button>
    </div>
  )
}
