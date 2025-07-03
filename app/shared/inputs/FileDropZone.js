'use client'

import { useState, useRef } from 'react'
import { useSnackbar } from 'helpers/useSnackbar'
import Overline from '@shared/typography/Overline'
import { LuCloudUpload } from 'react-icons/lu'

// TODO: add more file types
const ACCEPTED_FILE_TYPES = {
  image: ['image/png', 'image/jpeg', 'image/gif'],
}

/**
 * @typedef {Object} FileDropZoneProps
 * @property {string[]} fileTypes Types of files to accept
 * @property {(selected: File) => void} onChange Callback to send newly selected file
 * @property {string} className css classes to add
 */

/**
 * Input element for drag + dropping file
 * Currently only for images
 * @param {FileDropZoneProps} props
 * @returns
 */
export default function FileDropZone({
  label = 'Add a Photo',
  fileTypes = ACCEPTED_FILE_TYPES.image,
  maxSize = 5000000,
  onChange,
  className = '',
}) {
  const { errorSnackbar } = useSnackbar()
  const [{ isDragging, cannotDrop }, setState] = useState({
    isDragging: false,
    cannotDrop: false,
  })
  const inputRef = useRef(null)

  function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()

    const [item] = e.dataTransfer.items

    if (!cannotDrop) {
      const file = item.getAsFile()

      if (file.size <= maxSize) {
        onChange(file)
      } else {
        notifyError('File size too large')
      }
    } else {
      notifyError('Invalid file type')
    }

    setState({
      isDragging: false,
      cannotDrop: false,
    })
  }

  function handleFileInput(e) {
    const [file] = e.target.files

    if (file.size <= maxSize) {
      onChange(file)
    } else {
      notifyError('File size too large')
      return false
    }
  }

  function handleDragOver(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleDragEnter(e) {
    e.preventDefault()
    e.stopPropagation()

    const [item] = e.dataTransfer.items

    if (item.kind === 'file' && fileTypes.includes(item.type)) {
      // acceptable file
      setState({
        isDragging: true,
        cannotDrop: false,
      })
    } else {
      // Invalid item or file type
      setState({
        isDragging: false,
        cannotDrop: true,
      })
    }
  }

  function handleDragLeave(e) {
    e.preventDefault()
    e.stopPropagation()
    setState({ isDragging: false, cannotDrop: false })
  }

  function handleClick(e) {
    inputRef.current.click()
  }

  function notifyError(msg) {
    errorSnackbar(msg)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className={`w-full h-32 border-2 border-dashed border-gray-500 rounded-2xl flex items-center justify-center ${
        isDragging
          ? 'bg-indigo-100'
          : cannotDrop
          ? 'bg-error-background border-error'
          : 'hover:bg-indigo-100 cursor'
      }  ${className}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick(e)}
    >
      <div className="pointer-events-none text-center">
        <LuCloudUpload size={24} className="inline" />
        {<Overline className="mt-2">{label}</Overline>}
      </div>
      <input
        ref={inputRef}
        hidden
        type="file"
        accept={fileTypes}
        onChange={handleFileInput}
      />
    </div>
  )
}
