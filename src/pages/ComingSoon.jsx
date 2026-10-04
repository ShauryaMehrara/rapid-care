export default function ComingSoon({ title, text }) {
  return (
    <>
      <h1>{title}</h1>
      <p className="lead">{text}</p>
      <div className="list"><div className="empty">This section is being built next.</div></div>
    </>
  )
}
