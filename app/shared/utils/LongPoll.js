import { noop } from '@shared/utils/noop'
import { useEffect, useState } from 'react'
import { useSingleEffect } from '@shared/hooks/useSingleEffect'

export const LongPoll = ({
  pollingMethod = async () => {},
  pollingDelay = 1000,
  onSuccess = noop,
  onError = noop,
  limit = 0,
  stopPolling = false,
}) => {
  const [intervalId, setIntervalId] = useState(null)
  const [count, setCount] = useState(0)

  const cleanupInterval = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
  }

  useEffect(() => {
    if (stopPolling || (limit && count >= limit)) {
      cleanupInterval()
    }
  }, [intervalId, stopPolling, count, limit])

  useEffect(() => {
    return () => {
      cleanupInterval()
    }
  }, [intervalId])

  const poll = async () => {
    try {
      const result = await pollingMethod()
      if (result) {
        onSuccess(result)
      } else {
        onError(result)
      }
    } catch (error) {
      onError(error)
    }
    setCount((prevCount) => prevCount + 1)
  }

  useSingleEffect(() => {
    setIntervalId(setInterval(poll, pollingDelay))
  }, [])
}
