'use client'
import { CopyToClipboard as CopyHelper } from 'react-copy-to-clipboard'
import { useSnackbar } from 'helpers/useSnackbar'

export default function CopyToClipboard({ children, text, onCopy }) {
  const { successSnackbar } = useSnackbar()
  const onCopyHandler = (text, result) => {
    successSnackbar('Copied to clipboard')
    onCopy?.(text, result)
  }

  return (
    <div>
      <CopyHelper text={text} onCopy={onCopyHandler}>
        <div>{children}</div>
      </CopyHelper>
    </div>
  )
}
