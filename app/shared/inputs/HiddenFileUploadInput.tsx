'use client'
import React, { forwardRef } from 'react'

/**
 * Hidden `<input type="file">` triggered by a visible Button via the
 * forwarded ref. Emits the selected File to `onChange`. Consumers handle
 * upload / validation / preview themselves with the raw File.
 *
 * Previously this also FileReader.readAsText'd the file before invoking
 * onChange, but every consumer underscore-discarded that argument (and on
 * binary PDFs the text decode produces garbage). Dropped the read entirely.
 */
interface HiddenFileUploadInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'type'
  > {
  onChange: (file: File) => void
}

const HiddenFileUploadInputRender = (
  { onChange, ...restProps }: HiddenFileUploadInputProps,
  ref: React.ForwardedRef<HTMLInputElement>,
): React.JSX.Element => {
  const handleFileInputOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const file = e.target.files?.[0]
    if (!file) return
    onChange(file)
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
