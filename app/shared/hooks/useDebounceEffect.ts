import { useEffect } from 'react'

export const useDebounceEffect = (fn: (...args: never[]) => void, waitTime: number, deps: never[] = []) => {
  useEffect(() => {
    const t = setTimeout(() => {
      fn.apply(undefined, deps)
    }, waitTime)

    return () => {
      clearTimeout(t)
    }
  }, [fn, waitTime, ...deps])
}

