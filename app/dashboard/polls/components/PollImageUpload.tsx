'use client'
import { useRef, useState } from 'react'
import Image from 'next/image'
import { LuCloudUpload } from 'react-icons/lu'
import { CircularProgress } from '@mui/material'
import { HiddenFileUploadInput } from '@shared/inputs/HiddenFileUploadInput'
import { uploadFileToS3 } from '@shared/utils/s3Upload'
import { apiRoutes } from 'gpApi/routes'
import { useMutation } from '@tanstack/react-query'
import imageCompression from 'browser-image-compression'

const ACCEPTED_FORMATS = ['.png', '.jpg', '.jpeg']
const MAX_SIZE_KB = 500

export const PollImageUpload: React.FC<{
  imageUrl?: string
  onUploaded: (imageUrl: string) => void
}> = ({ imageUrl, onUploaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [errorMessage, setErrorMessage] = useState('')

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const downsized = await imageCompression(file, {
        maxSizeMB: MAX_SIZE_KB / 1024,
        useWebWorker: true,
      })
      return uploadFileToS3(downsized, apiRoutes.polls.imageUploadUrl)
    },
    onSuccess: onUploaded,
    onError: () => {
      setErrorMessage('Failed to upload image')
    },
  })

  const selectedFile = mutation.variables

  const onFileBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChoose = async (file: File) => {
    setErrorMessage('')

    // Check file format
    const fileExtension = '.' + file.name?.split('.').pop()?.toLowerCase() || ''
    if (!ACCEPTED_FORMATS.includes(fileExtension)) {
      const error = `File format not supported. Please use ${ACCEPTED_FORMATS.join(
        ', ',
      )}`
      setErrorMessage(error)
      return
    }

    mutation.mutate(file)
  }

  return (
    <div className="w-full mt-12">
      <div
        className={`flex flex-col items-center justify-center w-full h-40 border-dashed border rounded-2xl p-4 cursor-pointer transition-colors ${
          errorMessage
            ? 'border-red-300 bg-red-50'
            : imageUrl
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={onFileBrowseClick}
        onDrop={(e) => {
          e.preventDefault()
          const files = e.dataTransfer.files
          if (files.length > 0) {
            handleFileChoose(files[0]!)
          }
        }}
        onDragOver={(e) => {
          e.preventDefault()
        }}
      >
        {mutation.isPending ? (
          <div className="flex flex-col items-center">
            <CircularProgress size={24} />
            <p className="leading-normal text-sm font-normal mt-2">
              Uploading...
            </p>
          </div>
        ) : imageUrl ? (
          <div className="flex flex-col items-center">
            <Image
              src={imageUrl}
              alt="Preview"
              width={200}
              height={200}
              className="object-cover rounded max-h-[100px] w-auto"
            />
            {selectedFile && (
              <p className="leading-normal text-sm font-normal mt-2 text-green-600">
                {selectedFile.name}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <LuCloudUpload size={24} className="inline" />
            <p className="leading-normal text-sm font-normal">Upload Image</p>
          </div>
        )}
      </div>

      <div className="mt-2">
        {errorMessage ? (
          <p className="text-xs font-normal text-red-600">{errorMessage}</p>
        ) : (
          <p className="text-xs font-normal text-muted-foreground">
            Recommended PNG or JPG format.
          </p>
        )}
      </div>

      <HiddenFileUploadInput
        ref={fileInputRef}
        onChange={(_, file) => handleFileChoose(file)}
        accept={ACCEPTED_FORMATS.join(',')}
      />
    </div>
  )
}
