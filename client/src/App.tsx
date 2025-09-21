import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import CustomerDashboard from './pages/CustomerDashboard'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App