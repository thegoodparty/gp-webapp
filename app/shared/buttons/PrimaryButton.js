'use client'
import ButtonLoading from './ButtonLoading'
import { buttonOnClickHandler } from '@shared/buttons/buttonOnClickHandler'
import { compileButtonClassName } from '@shared/buttons/compileButtonClassName'

export function setSize(baseClass, size, variant) {
  if (size === 'large') {
    baseClass['text-lg'] = true
    baseClass['py-3'] = true
    baseClass['px-6'] = true
    if (variant === 'outlined') {
      baseClass['py-3'] = false
      baseClass['py-3'] = true
    }
  } else if (size === 'medium') {
    baseClass['text-base'] = true
    baseClass['py-2'] = true
    baseClass['px-4'] = true
  } else if (size === 'small') {
    baseClass['text-sm'] = true
    baseClass['py-1'] = true
    baseClass['px-3'] = true
  }
}

export default function PrimaryButton({
  children,
  className = {},
  variant = 'contained',
  style = {},
  size = 'large',
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  ariaLabel,
  onClick,
  ...restProps
}) {
  let baseClass = {
    'rounded-lg': true,
    'font-medium': true,
    '[&>svg]:inline': true,
    'transition-colors': true,
    'focus-visible:outline-primary-dark/30': true,
  }
  if (variant === 'contained') {
    baseClass['bg-primary-dark'] = true
    baseClass['text-slate-50'] = true
    baseClass['hover:text-secondary-light'] = true
    baseClass['active:text-secondary-light'] = true
  } else if (variant === 'outlined') {
    baseClass['bg-white'] = true
    baseClass['text-primary'] = true
    baseClass['border-2'] = true
    baseClass['border-primary'] = true
    baseClass['hover:text-secondary-light'] = true
    baseClass['active:text-secondary-light'] = true
    baseClass['hover:bg-primary-dark'] = true
    baseClass['active:bg-primary-dark'] = true
  } else if (variant === 'text') {
    baseClass['text-primary'] = true
    baseClass['hover:text-slate-50'] = true
    baseClass['hover:bg-primary-dark'] = true
    baseClass['active:bg-primary-dark'] = true
  }
  setSize(baseClass, size, variant)
  if (disabled) {
    baseClass['cursor-not-allowed'] = true
    baseClass['bg-gray-600'] = true
    baseClass['text-gray-300'] = true
    baseClass['hover:text-gray-300'] = true
    baseClass['hover:text-secondary-light'] = false
    baseClass['active:text-secondary-light'] = false
    baseClass['bg-white'] = false
    baseClass['bg-primary-dark'] = false
    if (variant === 'outlined') {
      baseClass['border-primary'] = false
      baseClass['border-gray-200'] = true
      baseClass['bg-gray-600'] = false
      baseClass['bg-white'] = true
      baseClass['text-primary'] = false
      baseClass['text-gray-300'] = false
      baseClass['text-gray-500'] = true
      baseClass['hover:text-secondary-light'] = false
      baseClass['active:text-secondary-light'] = false
      baseClass['hover:bg-primary-dark'] = false
      baseClass['active:bg-primary-dark'] = false
    } else if (variant === 'text') {
      baseClass['bg-gray-600'] = false
      baseClass['bg-white'] = true
      baseClass['text-primary'] = false
      baseClass['text-gray-500'] = true
      baseClass['hover:text-slate-50'] = false
      baseClass['hover:bg-primary-dark'] = false
      baseClass['active:bg-primary-dark'] = false
    }
  }

  if (fullWidth) {
    baseClass['w-full'] = true
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
      type={type}
      aria-label={ariaLabel}
      {...restProps}
      onClick={buttonOnClickHandler(onClick)}
    >
      {loading ? <ButtonLoading /> : null}
      {children}
    </button>
  )
}
