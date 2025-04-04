'use client'
import ButtonLoading from './ButtonLoading'
import { setSize } from './PrimaryButton'
import { buttonOnClickHandler } from '@shared/buttons/buttonOnClickHandler'
import { compileButtonClassName } from '@shared/buttons/compileButtonClassName'

export default function SuccessButton({
  children,
  className = {},
  variant = 'contained',
  style = {},
  size = 'large',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  ...restProps
}) {
  let baseClass = {
    'rounded-lg': true,
    'font-medium': true,
    'transition-colors': true,
  }

  if (fullWidth) {
    baseClass['w-full'] = true
  }
  if (variant === 'contained') {
    baseClass['bg-success-main'] = true
    baseClass['text-white'] = true
    baseClass['hover:bg-success-light'] = true
    baseClass['active:bg-success-main'] = true
  } else if (variant === 'outlined') {
    baseClass['bg-white'] = true
    baseClass['text-indigo-900'] = true
    baseClass['border-2'] = true
    baseClass['border-green-400'] = true
    baseClass['hover:bg-green-400'] = true
    baseClass['active:bg-green-400'] = true
  } else if (variant === 'text') {
    baseClass['text-green-500'] = true
    baseClass['hover:bg-green-300'] = true
    baseClass['active:bg-green-300'] = true
    baseClass['hover:text-primary'] = true
    baseClass['active:text-primary'] = true
  }
  setSize(baseClass, size)
  if (disabled) {
    baseClass['cursor-not-allowed'] = true
    if (variant === 'contained') {
      baseClass['bg-green-50'] = true
      baseClass['text-gray-700'] = true

      baseClass['bg-green-400'] = false
      baseClass['text-indigo-900'] = false
      baseClass['hover:bg-green-300'] = false
      baseClass['active:bg-green-300'] = false
    } else if (variant === 'outlined') {
      baseClass['text-gray-500'] = true
      baseClass['border-green-50'] = true

      baseClass['text-indigo-900'] = false
      baseClass['border-green-400'] = false
      baseClass['hover:bg-green-400'] = false
      baseClass['active:bg-green-400'] = false
    } else if (variant === 'text') {
      baseClass['text-gray-500'] = true

      baseClass['text-green-500'] = false
      baseClass['hover:bg-green-300'] = false
      baseClass['active:bg-green-300'] = false
      baseClass['hover:text-primary'] = false
      baseClass['active:text-primary'] = false
    }
  }

  if (loading) {
    baseClass.flex = true
    baseClass['items-center'] = true
  }

  return (
    <button
      className={compileButtonClassName(baseClass, className)}
      style={style}
      disabled={disabled}
      {...restProps}
      onClick={buttonOnClickHandler(onClick)}
    >
      {loading ? <ButtonLoading /> : null}
      {children}
    </button>
  )
}
