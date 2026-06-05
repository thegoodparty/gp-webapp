'use client'
import { useState } from 'react'
import { Button, type ButtonProps } from '@styleguide'
import CopyToClipboard from '@shared/utils/CopyToClipboard'
import { CheckIcon, CopyIcon } from '@styleguide/components/ui/icons'
import React from 'react'

type LegacyColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'error'
  | 'warning'
  | 'info'
  | 'success'
  | 'neutral'
  | 'white'

type LegacyVariant = 'text' | 'outlined' | 'contained'

const variantMap: Record<LegacyVariant, ButtonProps['variant']> = {
  contained: 'default',
  outlined: 'outline',
  text: 'ghost',
}

const colorMap: Record<LegacyColor, ButtonProps['variant']> = {
  primary: 'default',
  secondary: 'secondary',
  tertiary: 'secondary',
  info: 'default',
  success: 'default',
  warning: 'destructive',
  error: 'destructive',
  neutral: 'secondary',
  white: 'whiteOutline',
}

interface CopyToClipboardButtonProps {
  copyText: string
  size?: 'small' | 'medium' | 'large'
  color?: LegacyColor
  variant?: LegacyVariant
  className?: string
  children?: React.ReactNode
}

const CopyToClipboardButton = ({
  copyText,
  size,
  color,
  variant,
  className = '',
  children,
}: CopyToClipboardButtonProps) => {
  const [copied, setCopied] = useState(false)

  const handleOnCopy = (_text: string, result: boolean): void => {
    if (result) {
      setCopied(true)
    }
    setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  const resolvedVariant: ButtonProps['variant'] = variant
    ? variantMap[variant]
    : color
    ? colorMap[color]
    : 'default'

  const resolvedSize = size as ButtonProps['size'] | undefined

  return (
    <CopyToClipboard text={copyText} onCopy={handleOnCopy}>
      <Button
        {...(resolvedSize ? { size: resolvedSize } : {})}
        variant={resolvedVariant}
        className={`flex items-center ${className}`.trim()}
      >
        {copied ? (
          <CheckIcon className="mr-2" />
        ) : (
          <CopyIcon className="mr-2" />
        )}
        {children}
      </Button>
    </CopyToClipboard>
  )
}

export default CopyToClipboardButton
