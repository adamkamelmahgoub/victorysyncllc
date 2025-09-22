
import { useMe } from '../lib/auth'
import { api } from '../lib/http'

export default function Dashboard() {
  const { data: me, isLoading } = useMe()

  const logout = async () => {
    await api('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  if (isLoading) return <div style={{ padding: 24 }}>Loading…</div>
  if (!me?.id) return <div style={{ padding: 24 }}>Not authorized</div>

  return (
    <div style={{ padding: 24 }}>
      <h2>Customer Portal</h2>
      <p>Signed in as {me.email}</p>
      <button onClick={logout}>Log out</button>
    </div>
  )
}
