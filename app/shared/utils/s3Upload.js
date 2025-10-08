'use client'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { IS_LOCAL, IS_PROD, IS_DEV } from 'appEnv'

export const getBucketName = () => {
  if (IS_LOCAL || IS_DEV) return 'assets-dev.goodparty.org'
  if (IS_PROD) return 'assets.goodparty.org'
  // We don't have a QA check, QA bucket is the fallback
  return 'assets-qa.goodparty.org'
}

export const uploadBlobToS3 = async ({ blobOrFile, fileType, fileName, folder }) => {

  if(!blobOrFile || !fileType || !fileName || !folder) {
    throw new Error('Missing required parameters')
  }
  
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  const sanitizedFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, '_')

  const resp = await clientFetch(apiRoutes.user.files.generateSignedUploadUrl, {
    fileType,
    fileName: sanitizedFileName,
    bucket: sanitizedFolder,
  })

  if (!resp.ok) {
    throw new Error(`Failed to get signed URL: ${resp.status} ${resp.statusText}`)
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
    throw new Error(`S3 upload failed: ${uploadResult.status} ${uploadResult.statusText}`)
  }

  const bucketName = getBucketName()
  const publicUrl = `https://${bucketName}/${sanitizedFolder}/${sanitizedFileName}`
  return publicUrl
}

export const uploadFileToS3 = async (file, folder) => {
  const { name: fileName, type: fileType } = file
  return uploadBlobToS3({ blobOrFile: file, fileType, fileName, folder })
}
