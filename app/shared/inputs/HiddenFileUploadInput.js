'use client'
import React, { forwardRef } from 'react'

const HiddenFileUploadInputRender = ({ onChange, ...restProps }, ref) => {
  const handleFileInputOnChange = (e) => {
    const file = e.target.files[0]
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
