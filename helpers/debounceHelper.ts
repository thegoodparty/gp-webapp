declare global {
  interface Window {
    timer?: ReturnType<typeof setTimeout>
  }
}

export const debounce = <TArgs extends unknown[]>(
  func: (...args: TArgs) => void,
  timeout: number = 600,
  ...args: TArgs
): void => {
  clearTimeout(window.timer)
  window.timer = setTimeout(() => {
    func(...args)
  }, timeout)
}

export const debounce2 = <TArgs extends unknown[]>(
  func: (...args: TArgs) => void,
  delay: number
): ((...args: TArgs) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return (...args: TArgs): void => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      timeoutId = null
      func(...args)
    }, delay)
  }
}

