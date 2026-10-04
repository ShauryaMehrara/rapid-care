// Animated heartbeat line, the signature motion of the site
const d = 'M0 70 H110 L130 70 L146 26 L168 114 L190 44 L206 70 H330 L350 70 L366 30 L388 108 L408 50 L424 70 H600'

export default function Ecg({ className = '' }) {
  return (
    <svg className={'ecg ' + className} viewBox="0 0 600 140" aria-hidden="true">
      <path className="base" d={d} />
      <path className="live" d={d} pathLength="1200" />
    </svg>
  )
}
