'use client'

import React, { useState } from 'react'
import { RiImageAddFill } from 'react-icons/ri'
import BlackButtonClient from '@shared/buttons/BlackButtonClient'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'

interface UploadAvatarResponse {
  avatar?: string
}

const fileSelectCallback = async (
  image: File,
  uploadCallback: (result: string | false) => void,
): Promise<void> => {
  const formData = new FormData()
  formData.append('file', image, image.name)
  const resp = await clientFetch<UploadAvatarResponse>(
    apiRoutes.user.uploadAvatar,
    formData,
    {
      revalidate: 3600,
    },
  )
  if (resp.data?.avatar) {
    uploadCallback(resp.data.avatar)
  } else {
    uploadCallback(false)
  }
}

interface ImageUploadWrapperProps {
  uploadCallback: (result: string | false) => void
  maxFileSize: number
  customElement?: React.ReactNode
  loadingStatusCallback?: (loading: boolean) => void
}

const ImageUploadWrapper = ({
  uploadCallback,
  maxFileSize,
  customElement,
  loadingStatusCallback = () => {},
}: ImageUploadWrapperProps): React.JSX.Element => {
  const [fileSizeError, setFileSizeError] = useState(false)

  const handleUploadImage = async (): Promise<void> => {
    loadingStatusCallback(true)
    setFileSizeError(false)
    const node = document.getElementById(
      'file-uploader',
    ) as HTMLInputElement | null
    const file = node?.files?.[0]
    if (file) {
      if (file.size > maxFileSize) {
        setFileSizeError(true)
        loadingStatusCallback(false)
        return
      }
      await fileSelectCallback(file, uploadCallback)
      loadingStatusCallback(false)
    }
  }

  return (
    <>
      {customElement ? (
        <label className={'transform-none text-base p-0 cursor-pointer'}>
          {customElement}
          <input
            type="file"
            hidden
            onChange={handleUploadImage}
            accept="image/*"
            id="file-uploader"
          />
        </label>
      ) : (
        <BlackButtonClient className="bg-black text-white py-0 px-6 font-bold">
          <RiImageAddFill /> &nbsp; Select &nbsp;&nbsp;
          <input
            type="file"
            hidden
            onChange={handleUploadImage}
            accept="image/*"
            id="file-uploader"
          />
        </BlackButtonClient>
      )}
      {fileSizeError && (
        <div className="mt-3 text-red-600">
          Max file size allowed: {maxFileSize / 1000}K{' '}
        </div>
      )}
    </>
  )
}

export default ImageUploadWrapper
