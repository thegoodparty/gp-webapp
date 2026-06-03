'use client'

import { useRef, useEffect, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rotation: number
  rotationSpeed: number
  opacity: number
  fadeRate: number
  color: string
  backColor: string
  shapeIndex: number
  wobbleAmplitude: number
  wobblePhase: number
  wobbleSpeed: number
  gravity: number
  drag: number
  scaleX: number
  flipSpeed: number
  flipPhase: number
}

interface ConfettiCanvasProps {
  play?: boolean
  particleCount?: number
  className?: string
}

const COLORS = ['#082a92', '#0d3cb5', '#1351d8', '#2563eb', '#75affe']

const SHAPES: [number, number][][] = [
  [
    [-0.5, -0.2],
    [0.1, -0.35],
    [0.5, -0.1],
    [0.4, 0.2],
    [-0.1, 0.35],
    [-0.5, 0.15],
  ],
  [
    [-0.3, -0.5],
    [0.2, -0.4],
    [0.5, 0.1],
    [0.1, 0.5],
    [-0.4, 0.3],
  ],
  [
    [-0.1, -0.5],
    [0.4, -0.15],
    [0.1, 0.5],
    [-0.4, 0.15],
  ],
  [
    [-0.45, -0.25],
    [0.3, -0.4],
    [0.5, 0.2],
    [-0.2, 0.4],
  ],
  [
    [-0.5, -0.12],
    [0.5, -0.18],
    [0.45, 0.15],
    [-0.5, 0.12],
  ],
  [
    [-0.35, -0.3],
    [0.15, -0.45],
    [0.4, -0.05],
    [0.2, 0.4],
    [-0.25, 0.3],
  ],
  [
    [-0.5, -0.15],
    [0.0, -0.3],
    [0.5, -0.1],
    [0.3, 0.25],
    [-0.3, 0.3],
  ],
]

const createParticle = (width: number): Particle => {
  const frontIndex = Math.floor(Math.random() * COLORS.length)
  const backIndex = Math.max(0, frontIndex - 2)

  return {
    x: Math.random() * width,
    y: -(Math.random() * 500 + 10),
    vx: (Math.random() - 0.5) * 6,
    vy: Math.random() * 4 + 8,
    size: Math.random() * 10 + 5,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.18,
    opacity: 1,
    fadeRate: Math.random() * 0.003 + 0.0012,
    color: COLORS[frontIndex] ?? COLORS[0]!,
    backColor: COLORS[backIndex] ?? COLORS[0]!,
    shapeIndex: Math.floor(Math.random() * SHAPES.length),
    wobbleAmplitude: Math.random() * 1.5 + 0.3,
    wobblePhase: Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 0.06 + 0.02,
    gravity: Math.random() * 0.03 + 0.04,
    drag: Math.random() * 0.001 + 0.0005,
    scaleX: 1,
    flipSpeed: Math.random() * 0.06 + 0.02,
    flipPhase: Math.random() * Math.PI * 2,
  }
}

const ConfettiCanvas = ({
  play = false,
  particleCount = 300,
  className,
}: ConfettiCanvasProps): React.JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animFrameRef = useRef<number>(0)
  const frameCountRef = useRef(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const h = canvas.offsetHeight
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    frameCountRef.current++

    const particles = particlesRef.current
    let alive = 0
    const frame = frameCountRef.current

    for (const p of particles) {
      if (p.opacity <= 0) continue
      alive++

      p.flipPhase += p.flipSpeed
      p.scaleX = Math.cos(p.flipPhase)

      const effectiveDrag = p.drag + Math.abs(p.scaleX) * 0.015

      p.wobblePhase += p.wobbleSpeed
      p.vx *= 1 - effectiveDrag
      p.x += p.vx + Math.sin(p.wobblePhase) * p.wobbleAmplitude

      p.vy += p.gravity
      p.vy *= 1 - effectiveDrag
      p.y += p.vy

      p.rotation += p.rotationSpeed
      p.rotationSpeed *= 0.999

      const travel = Math.max(0, p.y / h)
      if (travel > 0.3) {
        p.opacity -= p.fadeRate * (1 + travel * 3)
      }
      if (frame > 120) {
        p.opacity -= 0.012
      }

      const shape = SHAPES[p.shapeIndex]
      if (!shape || shape.length === 0) continue
      const first = shape[0]!

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.scale(p.scaleX, 1)
      ctx.globalAlpha = Math.max(0, p.opacity)
      ctx.fillStyle = p.scaleX < 0 ? p.backColor : p.color

      ctx.beginPath()
      ctx.moveTo(first[0] * p.size, first[1] * p.size)
      for (let i = 1; i < shape.length; i++) {
        const point = shape[i]!
        ctx.lineTo(point[0] * p.size, point[1] * p.size)
      }
      ctx.closePath()
      ctx.fill()

      ctx.restore()
    }

    if (alive > 0) {
      animFrameRef.current = requestAnimationFrame(draw)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  useEffect(() => {
    if (!play) return
    const canvas = canvasRef.current
    if (!canvas) return

    frameCountRef.current = 0
    const w = canvas.offsetWidth
    particlesRef.current = Array.from({ length: particleCount }, () =>
      createParticle(w),
    )

    cancelAnimationFrame(animFrameRef.current)
    animFrameRef.current = requestAnimationFrame(draw)

    return () => cancelAnimationFrame(animFrameRef.current)
  }, [play, particleCount, draw])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}

export default ConfettiCanvas
