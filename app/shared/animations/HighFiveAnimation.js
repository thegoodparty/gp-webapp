'use client'
import { useState, useEffect } from 'react'
import { Player, PlayerEvent } from '@lottiefiles/react-lottie-player'
import * as data from './highFive.json'

export default function HighFiveAnimation({
  loop = false,
  style = {},
  className = 'absolute bottom-0',
  callback = () => {},
  ...restProps
}) {
  const [animationKey, setAnimationKey] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleEvent = (event) => {
    if (event === PlayerEvent.Complete) {
      callback()
    }
  }

  const handleMouseEnter = () => {
    if (!isHovered) {
      setIsHovered(true)
      // Change the key to force React to create a new Player instance
      setAnimationKey((prev) => prev + 1)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  if (!isMounted) {
    return null
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ width: '145%', left: '-22.5%', ...style }}
    >
      <Player
        key={animationKey} // This forces a complete re-render when it changes
        loop={loop}
        autoplay={true}
        onEvent={handleEvent}
        style={{
          cursor: 'default',
          ...style,
        }}
        src={data}
        {...restProps}
      />
    </div>
  )
}
