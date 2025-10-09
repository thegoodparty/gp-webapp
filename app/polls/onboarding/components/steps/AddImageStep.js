'use client'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { LuCloudUpload } from "react-icons/lu"
import { CircularProgress } from '@mui/material'
import { HiddenFileUploadInput } from '@shared/inputs/HiddenFileUploadInput'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useOnboardingContext } from '../../../contexts/OnboardingContext'
import { uploadFileToS3 } from '@shared/utils/s3Upload'
import { getPollSubFolderName, FOLDER_NAME } from '../../../utils/s3utils'

const FILE_LIMIT_MB = 5
const ACCEPTED_FORMATS = ['.png', '.jpg', '.jpeg']

export default function AddImageStep({}) {
  const [authenticatedCampaign = {}] = useCampaign()
  const { setImageUrl } = useOnboardingContext()
  const campaignId = authenticatedCampaign?.id
  const campaignSlug = authenticatedCampaign?.slug
  
  const fileInputRef = useRef(null)
  const [fileInfo, setFileInfo] = useState(null)
  const [loadingFileUpload, setLoadingFileUpload] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [previewUrl, setPreviewUrl] = useState(null)

  // Cleanup blob URL on component unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const onFileBrowseClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChoose = async (fileData, file) => {
    setErrorMessage('')
    
    // Revoke previous blob URL to prevent memory leak
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    
    const fileSizeMb = file?.size / 1e6
    if (fileSizeMb > FILE_LIMIT_MB) {
      const error = `File size of ${fileSizeMb.toFixed(2)}MB is larger than ${FILE_LIMIT_MB}MB limit`
      setErrorMessage(error)
      return
    }

    // Check file format
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    if (!ACCEPTED_FORMATS.includes(fileExtension)) {
      const error = `File format not supported. Please use ${ACCEPTED_FORMATS.join(', ')}`
      setErrorMessage(error)
      return
    }

    // Validate campaign data before proceeding
    if (!campaignId || !campaignSlug) {
      const error = 'Campaign information is missing. Please refresh the page and try again.'
      setErrorMessage(error)
      return
    }

    setLoadingFileUpload(true)
    setFileInfo(file)

    // Create preview URL
    const imagePreviewUrl = URL.createObjectURL(file)
    setPreviewUrl(imagePreviewUrl)

      try {
        // THis is a little strange, but it is called bucket on our backend, but it's actually a folder inside of the main assets bucket
        const campaignFolderName = getPollSubFolderName(campaignId, campaignSlug)
        const folder = `${FOLDER_NAME}/${campaignFolderName}`
        const imageUrl = await uploadFileToS3(file, folder)
        
        // Store in onboarding context
        setImageUrl(imageUrl)
      } catch (e) {
        console.error(e)
        setErrorMessage('Failed to upload image')
        // Revoke blob URL on error
        URL.revokeObjectURL(imagePreviewUrl)
        setPreviewUrl(null)
      } finally {
        setLoadingFileUpload(false)
      }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileChoose(null, files[0])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  return (
    <div className="flex flex-col items-center md:justify-center mb-28 md:mb-4">
      <h1 className="text-left md:text-center font-semibold text-2xl md:text-4xl w-full">
        Text messages perform better with an image.
      </h1>  
      <p className="text-left md:text-center mt-4 text-lg font-normal text-muted-foreground w-full">
        Add your campaign headshot, logo or a community photo for credibility.
      </p>

      <div className="w-full mt-12">
        <div 
          className={`flex flex-col items-center justify-center w-full h-40 border-dashed border rounded-2xl p-4 cursor-pointer transition-colors ${
            errorMessage 
              ? 'border-red-300 bg-red-50' 
              : previewUrl 
                ? 'border-green-300 bg-green-50' 
                : 'border-gray-300 hover:border-gray-400'
          }`}
          onClick={onFileBrowseClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {loadingFileUpload ? (
            <div className="flex flex-col items-center">
              <CircularProgress size={24} />
              <p className="leading-normal text-sm font-normal mt-2">Uploading...</p>
            </div>
          ) : previewUrl ? (
            <div className="flex flex-col items-center">
              <Image 
                src={previewUrl} 
                alt="Preview" 
                width={80}
                height={80}
                className="object-cover rounded"
              />
              <p className="leading-normal text-sm font-normal mt-2 text-green-600">
                {fileInfo?.name}
              </p>
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
              Recommended PNG or JPG format. Max {FILE_LIMIT_MB}MB.
            </p>
          )}
        </div>

        <HiddenFileUploadInput
          ref={fileInputRef}
          onChange={handleFileChoose}
          accept={ACCEPTED_FORMATS.join(',')}
        />
      </div>
    </div>
  )
}
