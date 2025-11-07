type DebounceFunction = (...args: Parameters<typeof func>) => void

declare global {
  interface Window {
    timer?: ReturnType<typeof setTimeout>
  }
}

export const debounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  timeout: number = 600,
  ...args: Parameters<T>
): void => {
  clearTimeout(window.timer)
  window.timer = setTimeout(() => {
    func(...(args.length ? args : ([] as Parameters<T>)))
  }, timeout)
}

export const debounce2 = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    const context = this
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      timeoutId = null
      func.apply(context, args)
    }, delay)
  }
}

