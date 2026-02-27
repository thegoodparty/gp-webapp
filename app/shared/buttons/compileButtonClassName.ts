import clsx from 'clsx'

export const compileButtonClassName = (
  baseClass: Record<string, boolean> | string,
  className?: Record<string, boolean> | string,
): string => {
  let result = clsx(baseClass)

  if (className) {
    if (typeof className === 'string') {
      result += ` ${className}`
    } else {
      result += ` ${clsx(className)}`
    }
  }

  return result
}
