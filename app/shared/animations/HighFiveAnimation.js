'use client'
import { useState, useEffect } from 'react'
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
  const [Player, setPlayer] = useState(null)
  const [PlayerEvent, setPlayerEvent] = useState(null)

  useEffect(() => {
    setIsMounted(true)

    const loadPlayer = async () => {
      try {
        const { Player: LottiePlayer, PlayerEvent: LottiePlayerEvent } =
          await import('@lottiefiles/react-lottie-player')
        setPlayer(() => LottiePlayer)
        setPlayerEvent(LottiePlayerEvent)
      } catch (error) {
        console.warn('Failed to load Lottie player:', error)
      }
    }

    loadPlayer()
  }, [])

  const handleEvent = (event) => {
    if (PlayerEvent && event === PlayerEvent.Complete) {
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

  if (!isMounted || !Player) {
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
