'use client'
import { useState } from 'react'
import Button from '@shared/buttons/Button'
import CopyToClipboard from '@shared/utils/CopyToClipboard'
import { CheckRounded, ContentCopyRounded } from '@mui/icons-material'

interface CopyScriptButtonProps {
  scriptText: string
  trackingAttrs?: Record<string, string>
  onCopy?: (text: string, result: boolean) => void
}

export default function CopyScriptButton({
  scriptText,
  trackingAttrs = {},
  onCopy = () => {},
}: CopyScriptButtonProps): React.JSX.Element {
  const [copied, setCopied] = useState(false)

  async function handleOnCopy(text: string, result: boolean) {
    if (result) {
      setCopied(true)
    }
    setTimeout(() => {
      setCopied(false)
    }, 1500)
    onCopy(text, result)
  }
  return (
    <CopyToClipboard text={scriptText} onCopy={handleOnCopy}>
      <Button
        size="large"
        color="secondary"
        className="flex items-center"
        {...trackingAttrs}
      >
        {copied ? (
          <CheckRounded className="mr-2" />
        ) : (
          <ContentCopyRounded className="mr-2" />
        )}
        Copy Script
      </Button>
    </CopyToClipboard>
  )
}

