'use client'
import { ReactNode, CSSProperties, MouseEvent, HTMLAttributes } from 'react'
import ButtonLoading from './ButtonLoading'
import { setSize } from './PrimaryButton'
import { buttonOnClickHandler } from '@shared/buttons/buttonOnClickHandler'
import { compileButtonClassName } from '@shared/buttons/compileButtonClassName'

interface WarningButtonNewProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, 'onClick' | 'className'> {
  children?: ReactNode
  className?: Record<string, boolean> | string
  variant?: 'contained' | 'outlined' | 'text'
  style?: CSSProperties
  size?: 'large' | 'medium' | 'small'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
}

const WarningButtonNew = ({
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
}: WarningButtonNewProps) => {
  const baseClass: Record<string, boolean> = {
    'rounded-lg': true,
    'font-medium': true,
    'transition-colors': true,
  }

  if (fullWidth) {
    baseClass['w-full'] = true
  }
  if (variant === 'contained') {
    baseClass['bg-warning'] = true
    baseClass['text-primary'] = true
    baseClass['hover:bg-warning-light'] = true
    baseClass['active:bg-warning-light'] = true
  } else if (variant === 'outlined') {
    baseClass['text-warning-700'] = true
    baseClass['border-2'] = true
    baseClass['border-warning'] = true
    baseClass['hover:border-warning-600'] = true
    baseClass['hover:text-primary'] = true
    baseClass['hover:bg-warning'] = true
    baseClass['active:bg-warning'] = true
  } else if (variant === 'text') {
    baseClass['text-warning-900'] = true
    baseClass['hover:bg-warning'] = true
    baseClass['active:bg-warning'] = true
    baseClass['hover:text-primary'] = true
    baseClass['active:text-primary'] = true
  }
  setSize(baseClass, size, variant)
  if (disabled) {
    baseClass['cursor-not-allowed'] = true
    if (variant === 'contained') {
      baseClass['bg-warning-light'] = true
      baseClass['text-gray-700'] = true

      baseClass['bg-warning'] = false
      baseClass['text-primary'] = false
      baseClass['hover:bg-warning-light'] = false
      baseClass['active:bg-warning-light'] = false
    } else if (variant === 'outlined') {
      baseClass['bg-white'] = true
      baseClass['text-gray-500'] = true
      baseClass['border-warning-light'] = true

      baseClass['text-primary'] = false
      baseClass['border-warning'] = false
      baseClass['hover:border-warning'] = false
      baseClass['hover:bg-warning'] = false
      baseClass['hover:text-primary'] = false
      baseClass['active:text-primary'] = false
      baseClass['active:bg-warning'] = false
    } else if (variant === 'text') {
      baseClass['text-gray-500'] = true

      baseClass['text-warning'] = false
      baseClass['hover:bg-warning'] = false
      baseClass['active:bg-warning'] = false
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

export default WarningButtonNew
