import { Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Tests from './pages/Tests'
import Cart from './pages/Cart'
import Family from './pages/Family'
import Ambulance from './pages/Ambulance'
import Cremation from './pages/Cremation'
import Doctors from './pages/Doctors'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Wallpaper from './components/Wallpaper'
import { CartProvider } from './context/CartContext'

export default function App() {
  return (
    <CartProvider>
      <Wallpaper />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Auth mode="register" />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/dashboard" element={<Navigate to="/home" replace />} />

        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/home" element={<Home />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/family" element={<Family />} />
          <Route path="/ambulance" element={<Ambulance />} />
          <Route path="/cremation" element={<Cremation />} />
          <Route path="/doctors" element={<Doctors />} />
        </Route>

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </CartProvider>
  )
}
