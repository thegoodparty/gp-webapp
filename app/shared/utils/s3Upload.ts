'use client'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { IS_LOCAL, IS_PROD, IS_DEV } from 'appEnv'

export const getBucketName = (): string => {
  if (IS_LOCAL || IS_DEV) return 'assets-dev.goodparty.org'
  if (IS_PROD) return 'assets.goodparty.org'
  return 'assets-qa.goodparty.org'
}

interface UploadBlobParams {
  blobOrFile: Blob | File
  fileType: string
  fileName: string
  folder: string
}

interface SignedUploadUrlResponse {
  signedUploadUrl: string
}

export const uploadBlobToS3 = async ({
  blobOrFile,
  fileType,
  fileName,
  folder,
}: UploadBlobParams): Promise<string> => {
  if (!blobOrFile || !fileType || !fileName || !folder) {
    throw new Error('Missing required parameters')
  }

  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  const sanitizedFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, '_')

  const resp = await clientFetch<SignedUploadUrlResponse>(
    apiRoutes.user.files.generateSignedUploadUrl,
    {
      fileType,
      fileName: sanitizedFileName,
      bucket: sanitizedFolder,
    },
  )

  if (!resp.ok) {
    throw new Error(
      `Failed to get signed URL: ${resp.status} ${resp.statusText}`,
    )
  }

  const { signedUploadUrl } = resp.data

  const uploadResult = await fetch(signedUploadUrl, {
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

  const bucketName = getBucketName()
  const publicUrl = `https://${bucketName}/${sanitizedFolder}/${sanitizedFileName}`
  return publicUrl
}

export const uploadFileToS3 = async (
  file: File,
  folder: string,
): Promise<string> => {
  const { name: fileName, type: fileType } = file
  return uploadBlobToS3({ blobOrFile: file, fileType, fileName, folder })
}

