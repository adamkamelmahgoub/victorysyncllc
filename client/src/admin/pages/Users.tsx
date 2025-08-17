
import { useState, useEffect } from "react"

interface User {
  id: number
  email: string
  name: string
  role: string
  active: boolean
  createdAt: string
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch real users from API
    setTimeout(() => {
      setUsers([
        { id: 1, email: "admin@victorysync.com", name: "Admin User", role: "admin", active: true, createdAt: "2025-01-01" },
        { id: 2, email: "john@example.com", name: "John Doe", role: "user", active: true, createdAt: "2025-01-15" },
        { id: 3, email: "jane@company.com", name: "Jane Smith", role: "user", active: false, createdAt: "2025-01-10" }
      ])
      setLoading(false)
    }, 500)
  }, [])

  const toggleUserActive = async (userId: number) => {
    // TODO: Call API to toggle user active status
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, active: !u.active } : u
    ))
  }

  if (loading) {
    return <div>Loading users...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <button className="btn-vs">Add User</button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Created</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b">
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm ${
                      user.active 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3">{user.createdAt}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button 
                        className="btn-vs-outline text-xs"
                        onClick={() => toggleUserActive(user.id)}
                      >
                        {user.active ? "Deactivate" : "Activate"}
                      </button>
                      <button className="btn-vs-outline text-xs">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
