'use client'
import { CopyToClipboard as CopyHelper } from 'react-copy-to-clipboard-ts'
import { useSnackbar } from 'helpers/useSnackbar'
import React from 'react'

interface CopyToClipboardProps {
  children: React.ReactElement
  text: string
  onCopy?: (text: string, result: boolean) => void
}

const CopyToClipboard = ({ children, text, onCopy }: CopyToClipboardProps) => {
  const { successSnackbar } = useSnackbar()
  const onCopyHandler = (text: string, result: boolean): void => {
    successSnackbar('Copied to clipboard')
    onCopy?.(text, result)
  }

  return (
    <CopyHelper text={text} onCopy={onCopyHandler}>
      {children as React.ReactElement<{ onClick?: () => void }>}
    </CopyHelper>
  )
}

export default CopyToClipboard
