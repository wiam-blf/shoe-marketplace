import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

export default function Marketplace() {
  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', size: '' })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const loadProducts = async () => {
    setLoading(true)
    const params = {}
    if (filters.minPrice) params.minPrice = filters.minPrice
    if (filters.maxPrice) params.maxPrice = filters.maxPrice
    if (filters.size) params.size = filters.size
    const res = await api.get('/products', { params })
    setProducts(res.data)
    setLoading(false)
  }

  // runs once when page loads
  useEffect(() => { loadProducts() }, [])

  const placeOrder = async (product) => {
    if (!user) return navigate('/login')
    const qty = prompt('How many units do you want?')
    if (!qty) return
    await api.post('/orders', {
      product: product._id,
      quantity: Number(qty),
      sizes: product.sizes
    })
    alert('Order placed successfully!')
    navigate('/client')
  }

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>👟 Shoe Marketplace</h2>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: 12 }}>Hi, {user.name}</span>
              <button onClick={() => navigate(user.role === 'seller' ? '/seller' : '/client')}
                style={{ marginRight: 8, padding: '6px 16px' }}>
                Dashboard
              </button>
              <button onClick={logout} style={{ padding: '6px 16px' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: 12 }}>Login</Link>
              <Link to="/signup">Sign up</Link>
            </>
          )}
        </div>
      </div>

      {/* FILTERS */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
        <input
          placeholder="Min price"
          value={filters.minPrice}
          onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
          style={{ padding: 8, width: 120, borderRadius: 6, border: '1px solid #ddd' }}
        />
        <input
          placeholder="Max price"
          value={filters.maxPrice}
          onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
          style={{ padding: 8, width: 120, borderRadius: 6, border: '1px solid #ddd' }}
        />
        <input
          placeholder="Size (e.g. 40)"
          value={filters.size}
          onChange={e => setFilters({ ...filters, size: e.target.value })}
          style={{ padding: 8, width: 140, borderRadius: 6, border: '1px solid #ddd' }}
        />
        <button onClick={loadProducts}
          style={{ padding: '8px 20px', background: '#333', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          Filter
        </button>
        <button onClick={() => { setFilters({ minPrice: '', maxPrice: '', size: '' }); loadProducts() }}
          style={{ padding: '8px 20px', borderRadius: 6, cursor: 'pointer' }}>
          Clear
        </button>
      </div>

      {/* PRODUCTS GRID */}
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {products.map(p => (
            <div key={p._id} style={{ border: '1px solid #ddd', borderRadius: 10, padding: 16, background: '#fff' }}>
              {p.images?.[0] && (
                <img src={p.images[0]} alt={p.name}
                  style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />
              )}
              <h3 style={{ margin: '0 0 6px' }}>{p.name}</h3>
              <p style={{ margin: '0 0 4px', color: '#777', fontSize: 13 }}>
                {p.seller?.businessInfo || p.seller?.name}
              </p>
              <p style={{ margin: '0 0 4px' }}>💰 <strong>${p.price}</strong> per unit</p>
              <p style={{ margin: '0 0 4px' }}>📦 {p.quantity} units available</p>
              <p style={{ margin: '0 0 12px', fontSize: 13 }}>
                Sizes: {p.sizes?.join(', ')}
              </p>
              {user?.role === 'client' && (
                <button onClick={() => placeOrder(p)}
                  style={{ padding: '8px 16px', width: '100%', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                  Order Now
                </button>
              )}
            </div>
          ))}
          {products.length === 0 && (
            <p>No products found.</p>
          )}
        </div>
      )}
    </div>
  )
}