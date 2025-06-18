// This is needed for side effects that we want to guarantee only run once when
//  in development mode, due to a React 18 feature that runs effects twice:
//  https://react.dev/blog/2022/03/29/react-v18#new-strict-mode-behaviors:~:text=With%20Strict%20Mode%20in%20React%2018%2C%20React%20will%20simulate%20unmounting%20and%20remounting%20the%20component%20in%20development%20mode
import { useEffect, useRef } from 'react'

export const useSingleEffect = (callback = () => {}, deps = []) => {
  const hasRun = useRef(false)

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true
      callback()
    }
  }, [callback, ...deps])
}
