import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

export default function Login() {
  // useState stores what the user types in the form
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')  // stores error message if login fails
  const [loading, setLoading] = useState(false)
  
  // useNavigate lets us redirect to another page programmatically
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()  // stops the page from reloading on form submit
    setLoading(true)
    
    try {
      // send email and password to our backend
      const res = await api.post('/auth/login', form)
      
      // save the token and user info in localStorage
      // localStorage is like a small storage in the browser
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      
      // redirect based on role
      if (res.data.user.role === 'seller') {
        navigate('/seller')
      } else {
        navigate('/client')
      }
    } catch (err) {
      // show the error message from the backend
      setError(err.response?.data?.msg || 'Login failed')
    }
    
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
      <h2>Login</h2>
      
      {/* only shows if there's an error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          // when user types, update the form state
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
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '8px 24px', width: '100%' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      {/* Link is like <a> but for React pages - doesn't reload */}
      <p>No account? <Link to="/signup">Sign up here</Link></p>
    </div>
  )
}