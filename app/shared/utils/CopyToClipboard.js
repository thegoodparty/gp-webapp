'use client'
import { CopyToClipboard as CopyHelper } from 'react-copy-to-clipboard'
import { useSnackbar } from 'helpers/useSnackbar'

export default function CopyToClipboard({ children, text }) {
  const { successSnackbar } = useSnackbar()
  const onCopyHandler = () => {
    successSnackbar('Copied to clipboard')
  }

  return (
    <div>
      <CopyHelper text={text} onCopy={onCopyHandler}>
        <div>{children}</div>
      </CopyHelper>
    </div>
  )
}
