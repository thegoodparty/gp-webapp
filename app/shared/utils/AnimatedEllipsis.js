import { useEffect, useState } from 'react'

const ANIMATED_ELLIPSIS_INTERVAL = 250

export function AnimatedEllipsis() {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + '.' : ''))
    }, ANIMATED_ELLIPSIS_INTERVAL)

    // Cleanup function to clear the interval when the component is unmounted
    return () => clearInterval(intervalId)
  }, [])

  return <span>{dots}</span>
}
