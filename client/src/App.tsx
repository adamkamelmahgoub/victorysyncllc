
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMe } from './lib/auth'

export default function App() {
  const navigate = useNavigate()
  const { data: me, isLoading } = useMe()

  useEffect(() => {
    if (!isLoading) {
      if (me?.id) navigate('/customer-dashboard')
      else navigate('/login')
    }
  }, [isLoading, me, navigate])

  return <div style={{ padding: 24 }}>Loading…</div>
}
