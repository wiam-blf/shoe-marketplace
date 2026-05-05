import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Marketplace from './pages/Marketplace'
import SellerDashboard from './pages/SellerDashboard'
import ClientDashboard from './pages/ClientDashboard'

function PrivateRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem('user'))
  if (!user) return <Navigate to="/login" />
  if (role && user.role !== role) return <Navigate to="/" />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Marketplace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/seller" element={
          <PrivateRoute role="seller">
            <SellerDashboard />
          </PrivateRoute>
        } />
        <Route path="/client" element={
          <PrivateRoute role="client">
            <ClientDashboard />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}