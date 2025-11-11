'use client'
import { clientFetch } from 'gpApi/clientFetch'

export const uploadBlobToS3 = async ({
  blobOrFile,
  fileType,
  fileName,
  signedUrlRoute,
}) => {
  if (!blobOrFile || !fileType || !fileName || !signedUrlRoute) {
    throw new Error('Missing required parameters')
  }

  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')

  const requestBody = {
    fileName: sanitizedFileName,
    contentType: fileType,
  }

  const resp = await clientFetch(signedUrlRoute, requestBody)

  if (!resp.ok) {
    throw new Error(
      `Failed to get signed URL: ${resp.status} ${resp.statusText}`,
    )
  }

  const { signedUrl, publicUrl } = resp.data

  const uploadResult = await fetch(signedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': fileType,
    },
    body: blobOrFile,
  })

  if (!uploadResult.ok) {
    console.error(signedUrl)
    throw new Error(
      `S3 upload failed: ${uploadResult.status} ${uploadResult.statusText}`,
    )
  }

  return publicUrl
}

export const uploadFileToS3 = async (file, signedUrlRoute) => {
  const { name: fileName, type: fileType } = file
  return uploadBlobToS3({
    blobOrFile: file,
    fileType,
    fileName,
    signedUrlRoute,
  })
}
