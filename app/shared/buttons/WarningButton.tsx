'use client'
import { ReactNode, CSSProperties, MouseEvent, HTMLAttributes } from 'react'
import clsx from 'clsx'
import ButtonLoading from './ButtonLoading'
import { setSize } from './PrimaryButton'
import { buttonOnClickHandler } from '@shared/buttons/buttonOnClickHandler'

interface WarningButtonProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'onClick' | 'className'> {
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

const WarningButton = ({
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
}: WarningButtonProps) => {
  const baseClass: Record<string, boolean> = {
    'rounded-lg': true,
    'font-medium': true,
    'transition-colors': true,
  }

  if (fullWidth) {
    baseClass['w-full'] = true
  }
  if (variant === 'contained') {
    baseClass['bg-lime-400'] = true
    baseClass['text-primary'] = true
    baseClass['hover:bg-secondary-light'] = true
    baseClass['active:bg-secondary-light'] = true
  } else if (variant === 'outlined') {
    baseClass['text-yellow-700'] = true
    baseClass['border-2'] = true
    baseClass['border-yellow-700'] = true
    baseClass['hover:border-yellow-600'] = true
    baseClass['hover:text-primary'] = true
    baseClass['hover:bg-yellow-600'] = true
    baseClass['active:bg-yellow-600'] = true
  } else if (variant === 'text') {
    baseClass['text-lime-900'] = true
    baseClass['hover:bg-lime-400'] = true
    baseClass['active:bg-lime-400'] = true
    baseClass['hover:text-primary'] = true
    baseClass['active:text-primary'] = true
  }
  setSize(baseClass, size, variant)
  if (disabled) {
    baseClass['cursor-not-allowed'] = true
    if (variant === 'contained') {
      baseClass['bg-lime-100'] = true
      baseClass['text-gray-700'] = true

      baseClass['bg-lime-400'] = false
      baseClass['text-primary'] = false
      baseClass['hover:bg-secondary-light'] = false
      baseClass['active:bg-secondary-light'] = false
    } else if (variant === 'outlined') {
      baseClass['bg-white'] = true
      baseClass['text-gray-500'] = true
      baseClass['border-yellow-100'] = true

      baseClass['text-primary'] = false
      baseClass['border-yellow-700'] = false
      baseClass['hover:border-yellow-600'] = false
      baseClass['hover:bg-yellow-600'] = false
      baseClass['active:bg-yellow-600'] = false
    } else if (variant === 'text') {
      baseClass['text-gray-500'] = true

      baseClass['text-lime-900'] = false
      baseClass['hover:bg-lime-400'] = false
      baseClass['active:bg-lime-400'] = false
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
      className={clsx(
        baseClass,
        typeof className === 'string' ? className : clsx(className)
      )}
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

export default WarningButton

