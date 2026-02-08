'use client'
import { useEffect, useState } from 'react'
import Sticky from 'react-stickynode'

interface StickyCardProps {
  children: React.ReactNode
}

export default function StickyCard({
  children,
}: StickyCardProps): React.JSX.Element {
  const [winWidth, setWinWidth] = useState(1200)
  useEffect(() => {
    const handleResize = () => {
      setWinWidth(window.innerWidth)
    }

    if (window) {
      setWinWidth(window.innerWidth)
      window.addEventListener('resize', handleResize)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <Sticky top={72} bottomBoundary="#sticky-end" enabled={winWidth > 1024}>
      {children}
    </Sticky>
  )
}
