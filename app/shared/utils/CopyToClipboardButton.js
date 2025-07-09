'use client'
import { useState } from 'react'
import Button from '@shared/buttons/Button'
import CopyToClipboard from '@shared/utils/CopyToClipboard'
import { CheckRounded, ContentCopyRounded } from '@mui/icons-material'

export default function CopyToClipboardButton({
  copyText,
  size,
  color,
  variant,
  className = '',
  children,
}) {
  const [copied, setCopied] = useState(false)

  async function handleOnCopy(_text, result) {
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
        size={size}
        color={color}
        variant={variant}
        className={`flex items-center ${className}`}
      >
        {copied ? (
          <CheckRounded className="mr-2" />
        ) : (
          <ContentCopyRounded className="mr-2" />
        )}
        {children}
      </Button>
    </CopyToClipboard>
  )
}
