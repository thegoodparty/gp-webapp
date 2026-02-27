import { useState, useRef, useCallback, useEffect } from 'react'

interface UseTextStreamingReturn {
  isStreaming: boolean
  streamingText: string
  streamText: (text: string, onComplete: (text: string) => void) => void
  reset: () => void
}

export function useTextStreaming(delayMs: number = 30): UseTextStreamingReturn {
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const streamText = useCallback(
    (text: string, onComplete: (text: string) => void) => {
      setIsStreaming(true)
      setStreamingText('')
      let currentIndex = 0

      const streamCharacter = () => {
        if (currentIndex < text.length) {
          setStreamingText(text.substring(0, currentIndex + 1))
          currentIndex++
          timeoutRef.current = setTimeout(streamCharacter, delayMs)
        } else {
          setIsStreaming(false)
          onComplete(text)
          setStreamingText('')
        }
      }

      streamCharacter()
    },
    [delayMs],
  )

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsStreaming(false)
    setStreamingText('')
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    isStreaming,
    streamingText,
    streamText,
    reset,
  }
}
