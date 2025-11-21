import { useEffect } from 'react'

export const useDebounceEffect = (fn: () => void, waitTime: number, deps: (string | number | boolean | null | undefined)[]) => {
  useEffect(() => {
    const t = setTimeout(() => {
      fn()
    }, waitTime)

    return () => {
      clearTimeout(t)
    }
  }, [fn, waitTime, ...deps])
}

