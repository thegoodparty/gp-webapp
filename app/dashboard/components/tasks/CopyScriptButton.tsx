'use client'
import { useState } from 'react'
import { Button } from '@styleguide'
import CopyToClipboard from '@shared/utils/CopyToClipboard'
import { CheckIcon, CopyIcon } from '@styleguide/components/ui/icons'
import { noop } from '@shared/utils/noop'

interface CopyScriptButtonProps {
  scriptText: string
  trackingAttrs?: Record<string, string>
  onCopy?: (text: string, result: boolean) => void
}

export default function CopyScriptButton({
  scriptText,
  trackingAttrs = {},
  onCopy = noop,
}: CopyScriptButtonProps): React.JSX.Element {
  const [copied, setCopied] = useState(false)

  const handleOnCopy = async (text: string, result: boolean) => {
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
        variant="secondary"
        className="flex items-center"
        {...trackingAttrs}
      >
        {copied ? (
          <CheckIcon className="mr-2" />
        ) : (
          <CopyIcon className="mr-2" />
        )}
        Copy Script
      </Button>
    </CopyToClipboard>
  )
}
