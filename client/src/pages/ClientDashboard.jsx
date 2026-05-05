import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function ClientDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/orders/mine').then(res => {
      setOrders(res.data)
      setLoading(false)
    })
  }, [])

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const statusColor = {
    pending: '#f0a500',
    accepted: '#2ecc71',
    rejected: '#e74c3c',
    shipped: '#3498db'
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>My Orders</h2>
        <div>
          <button onClick={() => navigate('/')}
            style={{ marginRight: 8, padding: '6px 16px' }}>
            Browse Products
          </button>
          <button onClick={logout} style={{ padding: '6px 16px' }}>Logout</button>
        </div>
      </div>

      {/* ORDERS LIST */}
      {loading ? (
        <p>Loading your orders...</p>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: 60 }}>
          <p style={{ fontSize: 18, color: '#888' }}>You have no orders yet.</p>
          <button onClick={() => navigate('/')}
            style={{ padding: '10px 24px', background: '#333', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', marginTop: 12 }}>
            Browse Products
          </button>
        </div>
      ) : (
        orders.map(o => (
          <div key={o._id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 12 }}>
            <h3 style={{ margin: '0 0 8px' }}>{o.product?.name}</h3>
            <p style={{ margin: '0 0 4px' }}>Quantity: {o.quantity} units</p>
            <p style={{ margin: '0 0 4px' }}>
              Price per unit: ${o.product?.price}
            </p>
            <p style={{ margin: '0 0 4px' }}>
              Total: <strong>${o.quantity * o.product?.price}</strong>
            </p>
            <p style={{ margin: '0 0 4px' }}>
              Status: <span style={{ color: statusColor[o.status], fontWeight: 600 }}>
                {o.status}
              </span>
            </p>
            <p style={{ margin: 0, color: '#888', fontSize: 12 }}>
              Ordered on: {new Date(o.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  )
}