const paths = {
  tests: (
    <>
      <path d="M9 3h6" />
      <path d="M10 3v5.5L5.2 17.5A2 2 0 0 0 7 20.5h10a2 2 0 0 0 1.8-3L14 8.5V3" />
      <path d="M7.6 14h8.8" />
    </>
  ),
  ambulance: (
    <>
      <path d="M2 16V7h12v9" />
      <path d="M14 10h4l3 3v3h-2" />
      <path d="M2 16h3M9 16h6" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M8 9v4M6 11h4" />
    </>
  ),
  cremation: (
    <>
      <path d="M2 16V8h13l5 4v4h-1" />
      <path d="M2 16h3M9 16h6" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M5 11.5h4M11 11.5h2.5" />
    </>
  ),
  doctor: (
    <>
      <path d="M6 3v6a4 4 0 0 0 8 0V3" />
      <path d="M4 3h4M12 3h4" />
      <path d="M10 13v2a5 5 0 0 0 10 0v-2" />
      <circle cx="20" cy="11" r="2" />
    </>
  ),
  family: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17.5" cy="9" r="2.5" />
      <path d="M17 14.2c2.8 0 5 2.1 5 4.8" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
}

export function Icon({ name, size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}
