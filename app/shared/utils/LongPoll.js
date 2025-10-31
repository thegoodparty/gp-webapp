import { noop } from '@shared/utils/noop'
import { useEffect, useRef } from 'react'
import { useSingleEffect } from '@shared/hooks/useSingleEffect'

export const LongPoll = ({
  pollingMethod = async () => {},
  pollingDelay = 1000,
  onSuccess = noop,
  onError = noop,
  limit = 0,
  stopPolling = false,
}) => {
  const timeoutIdRef = useRef(null)
  const countRef = useRef(0)
  const stopPollingRef = useRef(stopPolling)
  const pollingMethodRef = useRef(pollingMethod)
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    stopPollingRef.current = stopPolling
    pollingMethodRef.current = pollingMethod
    onSuccessRef.current = onSuccess
    onErrorRef.current = onError
  }, [stopPolling, pollingMethod, onSuccess, onError])

  useEffect(() => {
    if (stopPolling || (limit && countRef.current >= limit)) {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current)
        timeoutIdRef.current = null
      }
    }
  }, [stopPolling, limit])

  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current)
        timeoutIdRef.current = null
      }
    }
  }, [])

  useSingleEffect(() => {
    const poll = async () => {
      try {
        const result = await pollingMethodRef.current()
        if (result) {
          onSuccessRef.current(result)
        } else {
          onErrorRef.current(result)
        }
      } catch (error) {
        onErrorRef.current(error)
      }

      countRef.current += 1

      if (!stopPollingRef.current && (!limit || countRef.current < limit)) {
        timeoutIdRef.current = setTimeout(poll, pollingDelay)
      }
    }

    poll()
  }, [])
}
