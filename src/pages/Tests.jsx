import { useState } from 'react'
import { Link } from 'react-router-dom'
import { tests, packages, rupees } from '../data/tests'
import { useCart } from '../context/CartContext'

export default function Tests() {
  const [view, setView] = useState('tests')
  const [query, setQuery] = useState('')
  const { has, toggle, items, total } = useCart()

  const q = query.trim().toLowerCase()
  const shownTests = tests.filter(
    (t) => !q || t.name.toLowerCase().includes(q) || t.full.toLowerCase().includes(q)
  )
  const shownPackages = packages.filter(
    (p) => !q || p.name.toLowerCase().includes(q) || p.includes.some((i) => i.toLowerCase().includes(q))
  )

  const add = (item, type) => toggle({ id: item.id, name: item.name, price: item.price, type })

  return (
    <>
      <h1>Book medical tests</h1>
      <p className="lead">Search for a test, add it to your cart, and book a time for sample collection.</p>

      <input
        className="input search"
        placeholder={view === 'tests' ? 'Search tests, e.g. CBC or complete blood count' : 'Search packages or a test inside them'}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="segmented">
        <button className={view === 'tests' ? 'on' : ''} onClick={() => setView('tests')}>Individual tests</button>
        <button className={view === 'packages' ? 'on' : ''} onClick={() => setView('packages')}>Diagnostic packages</button>
      </div>

      {view === 'tests' ? (
        <div className="list">
          {shownTests.length === 0 && <div className="empty">No test matches "{query}". Try a shorter name.</div>}
          {shownTests.map((t) => (
            <div className="row" key={t.id}>
              <div className="row-main">
                <div className="row-name">{t.name}</div>
                <div className="row-sub">{t.full}</div>
              </div>
              <div className="price">{rupees(t.price)}</div>
              <button
                className={'add-btn' + (has(t.id) ? ' added' : '')}
                onClick={() => add(t, 'test')}
                aria-label={has(t.id) ? `Remove ${t.name} from cart` : `Add ${t.name} to cart`}
              >
                {has(t.id) ? '\u2713' : '+'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="packages">
          {shownPackages.length === 0 && <div className="empty">No package matches "{query}".</div>}
          {shownPackages.map((p) => (
            <div className="pkg" key={p.id}>
              <div>
                <div className="row-name">{p.name}</div>
                <div className="row-sub">{p.desc}</div>
              </div>
              <ul>
                {p.includes.map((i) => <li key={i}>{i}</li>)}
              </ul>
              <div className="pkg-foot">
                <span className="price">{rupees(p.price)}</span>
                <button
                  className={'btn small' + (has(p.id) ? ' outline' : '')}
                  onClick={() => add(p, 'package')}
                >
                  {has(p.id) ? 'Remove' : 'Add to cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="cartbar">
          <div className="cartbar-inner">
            <span>{items.length} {items.length === 1 ? 'item' : 'items'} in cart &nbsp;|&nbsp; {rupees(total)}</span>
            <Link to="/cart" className="btn light">View cart</Link>
          </div>
        </div>
      )}
    </>
  )
}
