'use client'

import { useState, useRef } from 'react'
import { useSnackbar } from 'helpers/useSnackbar'
import Overline from '@shared/typography/Overline'
import { LuCloudUpload } from 'react-icons/lu'

const ACCEPTED_FILE_TYPES = {
  image: ['image/png', 'image/jpeg', 'image/gif'],
}

interface FileDropZoneProps {
  label?: string
  fileTypes?: string[]
  maxSize?: number
  onChange: (file: File | null) => void
  className?: string
}

const FileDropZone = ({
  label = 'Add a Photo',
  fileTypes = ACCEPTED_FILE_TYPES.image,
  maxSize = 5000000,
  onChange,
  className = '',
}: FileDropZoneProps): React.JSX.Element => {
  const { errorSnackbar } = useSnackbar()
  const [{ isDragging, cannotDrop }, setState] = useState({
    isDragging: false,
    cannotDrop: false,
  })
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const item = e.dataTransfer.items?.[0]

    if (!cannotDrop && item) {
      const file = item.getAsFile()

      if (file && file.size <= maxSize) {
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

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      if (file.size <= maxSize) {
        onChange(file)
      } else {
        notifyError('File size too large')
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const item = e.dataTransfer.items?.[0]

    if (item && item.kind === 'file' && fileTypes.includes(item.type)) {
      setState({
        isDragging: true,
        cannotDrop: false,
      })
    } else {
      setState({
        isDragging: false,
        cannotDrop: true,
      })
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setState({ isDragging: false, cannotDrop: false })
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const notifyError = (msg: string) => {
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
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className="pointer-events-none text-center">
        <LuCloudUpload size={24} className="inline" />
        {<Overline className="mt-2">{label}</Overline>}
      </div>
      <input
        ref={inputRef}
        hidden
        type="file"
        accept={fileTypes.join(',')}
        onChange={handleFileInput}
      />
    </div>
  )
}

export default FileDropZone

