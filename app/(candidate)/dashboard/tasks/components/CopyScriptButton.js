'use client'
import { useState } from 'react'
import Button from '@shared/buttons/Button'
import CopyToClipboard from '@shared/utils/CopyToClipboard'
import { CheckRounded, ContentPasteRounded } from '@mui/icons-material'

export default function CopyScriptButton({ scriptText }) {
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
    <CopyToClipboard text={scriptText} onCopy={handleOnCopy}>
      <Button size="large" color="secondary" className="flex items-center">
        {copied ? (
          <CheckRounded className="mr-2" />
        ) : (
          <ContentPasteRounded className="mr-2" />
        )}
        Copy Script
      </Button>
    </CopyToClipboard>
  )
}
