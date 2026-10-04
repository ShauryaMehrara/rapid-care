import { Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth'
import Tests from './pages/Tests'
import Cart from './pages/Cart'
import Family from './pages/Family'
import ComingSoon from './pages/ComingSoon'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { CartProvider } from './context/CartContext'

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Auth mode="register" />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/dashboard" element={<Navigate to="/tests" replace />} />

        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/tests" element={<Tests />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/family" element={<Family />} />
          <Route path="/ambulance" element={<ComingSoon title="Emergency ambulance" text="Request an ambulance to your location." />} />
          <Route path="/cremation" element={<ComingSoon title="Cremation transport" text="Arrange respectful transport when a family needs it." />} />
          <Route path="/doctors" element={<ComingSoon title="Doctor consultation" text="Find a doctor and book a consultation." />} />
        </Route>
      </Routes>
    </CartProvider>
  )
}
