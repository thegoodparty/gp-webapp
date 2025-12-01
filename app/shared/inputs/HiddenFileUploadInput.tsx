'use client'
import React, { forwardRef } from 'react'

interface HiddenFileUploadInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  onChange: (result: string | ArrayBuffer | null, file: File) => void
}

const HiddenFileUploadInputRender = (
  { onChange, ...restProps }: HiddenFileUploadInputProps,
  ref: React.ForwardedRef<HTMLInputElement>
): React.JSX.Element => {
  const handleFileInputOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => onChange(reader.result, file)
    reader.readAsText(file)
  }

  return (
    <input
      className="hidden"
      ref={ref}
      type="file"
      onChange={handleFileInputOnChange}
      {...restProps}
    />
  )
}

export const HiddenFileUploadInput = forwardRef(HiddenFileUploadInputRender)

