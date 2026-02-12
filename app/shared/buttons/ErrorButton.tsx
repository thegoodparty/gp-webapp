'use client'
import { ReactNode, CSSProperties, MouseEvent, HTMLAttributes } from 'react'
import clsx from 'clsx'
import ButtonLoading from './ButtonLoading'
import { setSize } from './PrimaryButton'
import { buttonOnClickHandler } from '@shared/buttons/buttonOnClickHandler'

interface ErrorButtonProps
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
  dataTestId?: string
}

const ErrorButton = ({
  children,
  className = {},
  variant = 'contained',
  style = {},
  size = 'large',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  dataTestId,
}: ErrorButtonProps) => {
  const baseClass: Record<string, boolean> = {
    'rounded-lg': true,
    'font-medium': true,
    'transition-colors': true,
  }
  if (fullWidth) {
    baseClass['w-full'] = true
  }
  if (variant === 'contained') {
    baseClass['bg-red-500'] = true
    baseClass['text-slate-50'] = true
    baseClass['hover:bg-red-400'] = true
    baseClass['active:bg-red-400'] = true
  } else if (variant === 'outlined') {
    baseClass['bg-white'] = true
    baseClass['text-red-500'] = true
    baseClass['border-2'] = true
    baseClass['border-red-500'] = true
    baseClass['hover:bg-red-500'] = true
    baseClass['active:bg-red-500'] = true
    baseClass['hover:text-slate-50'] = true
    baseClass['active:text-slate-50'] = true
  } else if (variant === 'text') {
    baseClass['text-red-500'] = true
    baseClass['hover:bg-red-50'] = true
    baseClass['active:bg-red-50'] = true
  }
  setSize(baseClass, size, variant)
  if (disabled) {
    baseClass['cursor-not-allowed'] = true
    if (variant === 'contained') {
      baseClass['bg-red-100'] = true
      baseClass['text-gray-100'] = true

      baseClass['bg-red-500'] = false
      baseClass['text-slate-50'] = false
      baseClass['hover:bg-red-400'] = false
      baseClass['active:bg-red-400'] = false
    } else if (variant === 'outlined') {
      baseClass['bg-white'] = true
      baseClass['text-gray-500'] = true
      baseClass['border-red-50'] = true

      baseClass['bg-white'] = false
      baseClass['text-primary'] = false
      baseClass['border-red-500'] = false
      baseClass['hover:bg-red-500'] = false
      baseClass['active:bg-red-500'] = false
      baseClass['hover:text-slate-50'] = false
      baseClass['active:text-slate-50'] = false
    } else if (variant === 'text') {
      baseClass['text-red-200'] = true

      baseClass['text-red-500'] = false
      baseClass['hover:bg-red-50'] = false
      baseClass['active:bg-red-50'] = false
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
        typeof className === 'string' ? className : clsx(className),
      )}
      style={style}
      disabled={disabled}
      onClick={buttonOnClickHandler(onClick)}
      data-testid={dataTestId || undefined}
    >
      {loading ? <ButtonLoading /> : null}
      {children}
    </button>
  )
}

export default ErrorButton
