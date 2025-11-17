'use client'
import { clientFetch } from 'gpApi/clientFetch'
import { ApiRoute } from 'gpApi/routes'

export const uploadBlobToS3 = async ({
  blobOrFile,
  fileType,
  fileName,
  signedUrlRoute,
}: {
  blobOrFile: Blob | File
  fileType: string
  fileName: string
  signedUrlRoute: ApiRoute
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

  const { signedUrl, publicUrl } = resp.data as {
    signedUrl: string
    publicUrl: string
  }

  const uploadResult = await fetch(signedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': fileType,
    },
    body: blobOrFile,
  })

  if (!uploadResult.ok) {
    throw new Error(
      `S3 upload failed: ${uploadResult.status} ${uploadResult.statusText}`,
    )
  }

  return publicUrl
}

export const uploadFileToS3 = async (file: File, signedUrlRoute: ApiRoute) => {
  const { name: fileName, type: fileType } = file
  return uploadBlobToS3({
    blobOrFile: file,
    fileType,
    fileName,
    signedUrlRoute,
  })
}
