'use client'
import { useState } from 'react'
import Button from '@shared/buttons/Button'
import CopyToClipboard from '@shared/utils/CopyToClipboard'
import { CheckIcon, CopyIcon } from '@styleguide/components/ui/icons'
import React from 'react'

interface CopyToClipboardButtonProps {
  copyText: string
  size?: 'small' | 'medium' | 'large'
  color?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'error'
    | 'warning'
    | 'info'
    | 'success'
    | 'neutral'
    | 'white'
  variant?: 'text' | 'outlined' | 'contained'
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
  return (
    <CopyToClipboard text={copyText} onCopy={handleOnCopy}>
      <Button
        {...(size && { size })}
        {...(color && { color })}
        {...(variant && { variant })}
        className={`
          flex
          items-center
          ${className}
        `.trim()}
        {...{
          children: (
            <>
              {copied ? (
                <CheckIcon className="mr-2" />
              ) : (
                <CopyIcon className="mr-2" />
              )}
              {children}
            </>
          ),
        }}
      />
    </CopyToClipboard>
  )
}

export default CopyToClipboardButton
