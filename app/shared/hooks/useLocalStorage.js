'use client'
import { useState } from 'react'

export const useLocalStorage = (key, initialValue) => {
  const localStorage =
    typeof window !== 'undefined' ? window.localStorage : null
  const [state, setState] = useState(() => {
    try {
      const value = localStorage?.getItem(key)
      return value ? JSON.parse(value) : initialValue
    } catch (error) {
      console.log(error)
    }
  })

  const setValue = (value) => {
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
