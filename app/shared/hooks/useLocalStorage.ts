'use client'
import { useState } from 'react'

export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] => {
  const localStorage =
    typeof window !== 'undefined' ? window.localStorage : null
  const [state, setState] = useState<T>(() => {
    try {
      const value = localStorage?.getItem(key)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- JSON.parse returns `any`; runtime validation would require a schema per storage key
      return value ? JSON.parse(value) : initialValue
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)): void => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value
      localStorage?.setItem(key, JSON.stringify(valueToStore))
      setState(value)
    } catch (error) {
      console.log(error)
    }
  }

  return [state, setValue]
}
