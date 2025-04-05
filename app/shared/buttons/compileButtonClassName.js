import clsx from 'clsx'

export const compileButtonClassName = (baseClass, className) => {
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
