import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rc_cart') || '[]') } catch { return [] }
  })

  useEffect(() => {
    try { localStorage.setItem('rc_cart', JSON.stringify(items)) } catch { /* ignore */ }
  }, [items])

  const has = (id) => items.some((i) => i.id === id)
  const toggle = (item) =>
    setItems((prev) =>
      prev.some((i) => i.id === item.id) ? prev.filter((i) => i.id !== item.id) : [...prev, item]
    )
  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id))
  const clear = () => setItems([])
  const total = items.reduce((sum, i) => sum + i.price, 0)

  return (
    <CartContext.Provider value={{ items, has, toggle, remove, clear, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
