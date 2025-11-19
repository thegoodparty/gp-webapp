import { useEffect, useRef, DependencyList } from 'react'

export const useSingleEffect = (
  callback: () => void,
  deps: DependencyList = [],
): void => {
  const hasRun = useRef(false)

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true
      return callback()
    }
  }, [callback, ...deps])
}
