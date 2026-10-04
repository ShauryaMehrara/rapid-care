import { useEffect, useRef } from 'react'

// Live wallpaper: soft drifting light, floating plus signs and rings
// that gently move away from the cursor.
export default function Wallpaper() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0, raf = 0
    let particles = []
    const mouse = { x: -9999, y: -9999 }

    const make = () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 8 + Math.random() * 24,
      plus: Math.random() < 0.55,
      vy: 0.12 + Math.random() * 0.35,
      sway: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.004,
      alpha: 0.1 + Math.random() * 0.16,
      ox: 0,
      oy: 0,
    })

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(48, Math.max(18, (w * h) / 40000)))
      particles = Array.from({ length: count }, make)
    }

    const glow = (x, y, radius, color) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, radius)
      g.addColorStop(0, color)
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
    }

    const frame = (t) => {
      ctx.clearRect(0, 0, w, h)

      // slow moving pools of light
      const big = Math.max(w, h) * 0.5
      glow(w * (0.25 + 0.2 * Math.sin(t * 0.00011)), h * (0.3 + 0.2 * Math.cos(t * 0.00008)), big, 'rgba(15,139,141,0.13)')
      glow(w * (0.75 + 0.18 * Math.cos(t * 0.00009)), h * (0.7 + 0.2 * Math.sin(t * 0.00012)), big, 'rgba(95,214,201,0.16)')

      for (const p of particles) {
        if (!reduce) {
          p.y -= p.vy
          p.x += Math.sin(t * 0.0006 + p.sway) * 0.18
          p.rot += p.vr
          if (p.y < -40) { p.y = h + 40; p.x = Math.random() * w }
        }

        // gently move away from the cursor, then settle back
        const dx = p.x + p.ox - mouse.x
        const dy = p.y + p.oy - mouse.y
        const dist = Math.hypot(dx, dy)
        if (dist < 150 && dist > 0) {
          const push = (150 - dist) * 0.025
          p.ox += (dx / dist) * push
          p.oy += (dy / dist) * push
        }
        p.ox *= 0.94
        p.oy *= 0.94

        ctx.save()
        ctx.translate(p.x + p.ox, p.y + p.oy)
        ctx.rotate(p.rot)
        ctx.strokeStyle = `rgba(15,139,141,${p.alpha})`
        ctx.lineCap = 'round'
        ctx.beginPath()
        if (p.plus) {
          ctx.lineWidth = p.size * 0.3
          ctx.moveTo(-p.size / 2, 0); ctx.lineTo(p.size / 2, 0)
          ctx.moveTo(0, -p.size / 2); ctx.lineTo(0, p.size / 2)
        } else {
          ctx.lineWidth = 2
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
        }
        ctx.stroke()
        ctx.restore()
      }

      if (!reduce) raf = requestAnimationFrame(frame)
    }

    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }

    resize()
    frame(0)
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return <canvas ref={ref} className="wallpaper" aria-hidden="true" />
}
