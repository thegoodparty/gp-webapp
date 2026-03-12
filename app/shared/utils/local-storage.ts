'use client'
import { useCallback, useSyncExternalStore } from 'react'

const listeners = new Map<string, Set<() => void>>()

const emitChange = (key: string) => {
  listeners.get(key)?.forEach((fn) => fn())
}

export const useLocalStorageValue = (
  key: string,
): [string | null, (newValue: string | null) => void] => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!listeners.has(key)) listeners.set(key, new Set())
      listeners.get(key)!.add(onStoreChange)

      const onStorage = (e: StorageEvent) => {
        if (e.key === key || e.key === null) onStoreChange()
      }
      window.addEventListener('storage', onStorage)

      return () => {
        listeners.get(key)!.delete(onStoreChange)
        if (listeners.get(key)!.size === 0) listeners.delete(key)
        window.removeEventListener('storage', onStorage)
      }
    },
    [key],
  )

  const getSnapshot = useCallback(() => localStorage.getItem(key), [key])

  const value = useSyncExternalStore(subscribe, getSnapshot, () => null)

  const setValue = useCallback(
    (newValue: string | null) => {
      if (newValue === null) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, newValue)
      }
      emitChange(key)
    },
    [key],
  )

  return [value, setValue]
}
