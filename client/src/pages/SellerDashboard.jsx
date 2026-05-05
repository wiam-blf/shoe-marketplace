import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function SellerDashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState({
    name: '', price: '', quantity: '',
    sizes: '', description: '', type: 'ready'
  })
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const loadData = async () => {
    const [pRes, oRes] = await Promise.all([
      api.get('/products'),
      api.get('/orders/mine')
    ])
    // only show this seller's products
    setProducts(pRes.data.filter(p => p.seller?._id === user.id))
    setOrders(oRes.data)
  }

  useEffect(() => { loadData() }, [])

  const addProduct = async (e) => {
    e.preventDefault()
    try {
      await api.post('/products', {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
        sizes: form.sizes.split(',').map(s => Number(s.trim()))
      })
      setMessage('Product added successfully!')
      setForm({ name: '', price: '', quantity: '', sizes: '', description: '', type: 'ready' })
      loadData()
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error adding product')
    }
  }

  const updateStatus = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status })
    loadData()
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return
    await api.delete(`/products/${id}`)
    loadData()
  }

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
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Seller Dashboard</h2>
        <div>
          <button onClick={() => navigate('/')} style={{ marginRight: 8, padding: '6px 16px' }}>
            Marketplace
          </button>
          <button onClick={logout} style={{ padding: '6px 16px' }}>Logout</button>
        </div>
      </div>

      {/* ADD PRODUCT FORM */}
      <div style={{ background: '#f9f9f9', padding: 20, borderRadius: 10, marginBottom: 32 }}>
        <h3 style={{ marginTop: 0 }}>Add New Product</h3>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        <form onSubmit={addProduct}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <input
              placeholder="Product name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={{ padding: 8, flex: 1, minWidth: 150, borderRadius: 6, border: '1px solid #ddd' }}
              required
            />
            <input
              placeholder="Price ($)"
              type="number"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              style={{ padding: 8, width: 100, borderRadius: 6, border: '1px solid #ddd' }}
              required
            />
            <input
              placeholder="Quantity"
              type="number"
              value={form.quantity}
              onChange={e => setForm({ ...form, quantity: e.target.value })}
              style={{ padding: 8, width: 100, borderRadius: 6, border: '1px solid #ddd' }}
              required
            />
            <input
              placeholder="Sizes: 38,39,40,41"
              value={form.sizes}
              onChange={e => setForm({ ...form, sizes: e.target.value })}
              style={{ padding: 8, width: 160, borderRadius: 6, border: '1px solid #ddd' }}
            />
            <input
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              style={{ padding: 8, flex: 1, minWidth: 200, borderRadius: 6, border: '1px solid #ddd' }}
            />
            <select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
            >
              <option value="ready">Ready-made</option>
              <option value="custom">Custom</option>
            </select>
            <button type="submit"
              style={{ padding: '8px 20px', background: '#333', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
              Add Product
            </button>
          </div>
        </form>
      </div>

      {/* MY PRODUCTS */}
      <h3>My Products ({products.length})</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 16, marginBottom: 32 }}>
        {products.map(p => (
          <div key={p._id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 14 }}>
            <strong>{p.name}</strong>
            <p style={{ margin: '4px 0' }}>${p.price} · {p.quantity} units</p>
            <p style={{ margin: '0 0 8px', color: '#888', fontSize: 13 }}>
              Sizes: {p.sizes?.join(', ')}
            </p>
            <button onClick={() => deleteProduct(p._id)}
              style={{ padding: '4px 12px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
              Delete
            </button>
          </div>
        ))}
        {products.length === 0 && <p>No products yet.</p>}
      </div>

      {/* INCOMING ORDERS */}
      <h3>Incoming Orders ({orders.length})</h3>
      {orders.map(o => (
        <div key={o._id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 12 }}>
          <p style={{ margin: '0 0 4px' }}>
            <strong>{o.product?.name}</strong> — {o.quantity} units
          </p>
          <p style={{ margin: '0 0 4px', color: '#555', fontSize: 13 }}>
            Client: {o.client?.name} ({o.client?.email})
          </p>
          <p style={{ margin: '0 0 12px' }}>
            Status: <span style={{ color: statusColor[o.status], fontWeight: 600 }}>{o.status}</span>
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => updateStatus(o._id, 'accepted')}
              style={{ padding: '6px 14px', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
              Accept
            </button>
            <button onClick={() => updateStatus(o._id, 'rejected')}
              style={{ padding: '6px 14px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
              Reject
            </button>
            <button onClick={() => updateStatus(o._id, 'shipped')}
              style={{ padding: '6px 14px', background: '#3498db', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
              Mark Shipped
            </button>
          </div>
        </div>
      ))}
      {orders.length === 0 && <p>No orders yet.</p>}
    </div>
  )
}