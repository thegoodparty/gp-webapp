'use client'
import { useState, useEffect } from 'react'
import LoadingDotsAnimation from '@shared/animations/LoadingDotsAnimation'
import Body2 from '@shared/typography/Body2'
import useChat from 'app/(candidate)/dashboard/campaign-assistant/components/useChat'

const messages = [
  'Reading your campaign data and strategies...',
  'Analyzing voter behavior and election trends...',
  'Scanning voter demographics to optimize outreach...',
  "Processing your campaign's performance metrics...",
]

const LoadingChatAnimation = (): React.JSX.Element | null => {
  const { loading, scrollDown } = useChat()
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    if (!loading) return

    const messageInterval = setInterval(() => {
      setFade(false)
      scrollDown()
      setTimeout(() => {
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length)
        setFade(true)
      }, 500)
    }, 3000)

    return () => clearInterval(messageInterval)
  }, [loading])

  if (!loading) {
    return null
  }

  return (
    <div className=" ml-6 mb-12 flex items-center">
      <div className="relative w-16">
        <LoadingDotsAnimation />
      </div>

      <Body2
        className={`transition-opacity duration-500 ${
          fade ? 'opacity-100' : 'opacity-0'
        } ml-4 text-gray-600`}
      >
        {messages[currentMessageIndex]}
      </Body2>
    </div>
  )
}

export default LoadingChatAnimation
