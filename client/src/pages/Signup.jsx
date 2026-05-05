import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client',      // default role is client
    businessInfo: '',
    contact: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/signup', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate(res.data.user.role === 'seller' ? '/seller' : '/client')
    } catch (err) {
      setError(err.response?.data?.msg || 'Signup failed')
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
      <h2>Create Account</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Full name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8 }}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8 }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8 }}
          required
        />

        {/* dropdown to choose role */}
        <select
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
          style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8 }}
        >
          <option value="client">I am a Client (I want to buy)</option>
          <option value="seller">I am a Seller (I want to sell)</option>
        </select>

        {/* only show business fields if seller is selected */}
        {form.role === 'seller' && (
          <>
            <input
              placeholder="Business name"
              value={form.businessInfo}
              onChange={e => setForm({ ...form, businessInfo: e.target.value })}
              style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8 }}
            />
            <input
              placeholder="Contact number"
              value={form.contact}
              onChange={e => setForm({ ...form, contact: e.target.value })}
              style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8 }}
            />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ padding: '8px 24px', width: '100%' }}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  )
}