'use client'
import { CopyToClipboard as CopyHelper } from 'react-copy-to-clipboard-ts'
import { useSnackbar } from 'helpers/useSnackbar'

export default function CopyToClipboard({ children, text, onCopy }) {
  const { successSnackbar } = useSnackbar()
  const onCopyHandler = (text, result) => {
    successSnackbar('Copied to clipboard')
    onCopy?.(text, result)
  }

  return (
    <CopyHelper text={text} onCopy={onCopyHandler}>
      {children}
    </CopyHelper>
  )
}
