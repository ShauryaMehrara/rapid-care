import { Link, useOutletContext } from 'react-router-dom'
import Ecg from '../components/Ecg'
import { Icon } from '../components/Icons'

const services = [
  { to: '/tests', icon: 'tests', title: 'Medical tests', text: 'Blood tests and health packages, with sample collection at your door.' },
  { to: '/ambulance', icon: 'ambulance', title: 'Emergency ambulance', text: 'Request the nearest ambulance in under a minute.', urgent: true },
  { to: '/cremation', icon: 'cremation', title: 'Cremation transport', text: 'Respectful transport when a family needs it.' },
  { to: '/doctors', icon: 'doctor', title: 'Doctor consultation', text: 'A video call or clinic visit with a specialist.' },
  { to: '/family', icon: 'family', title: 'Family profiles', text: 'Keep everyone you care for in one place.' },
]

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Home() {
  const { firstName } = useOutletContext()

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="hero-greet">{greeting()}{firstName ? `, ${firstName}` : ''}</p>
          <h1>Every health service your family needs, in one place.</h1>
          <p className="hero-sub">
            Book tests, call an ambulance, see a doctor. No more searching for the right website or phone number.
          </p>
          <div className="hero-actions">
            <Link to="/tests" className="btn on-dark">Book a test</Link>
            <Link to="/ambulance" className="sos">
              <span className="sos-dot" />
              Emergency ambulance
            </Link>
          </div>
        </div>
        <Ecg />
      </section>

      <h2 className="section-title">What do you need today?</h2>
      <div className="tiles">
        {services.map((s, i) => (
          <Link key={s.to} to={s.to} className={'tile' + (s.urgent ? ' urgent' : '')} style={{ '--i': i }}>
            <span className="tile-icon"><Icon name={s.icon} size={26} /></span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            <span className="tile-go">Open <Icon name="arrow" size={18} /></span>
          </Link>
        ))}
      </div>
    </>
  )
}
