'use client'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { IS_LOCAL, IS_PROD } from 'appEnv'

export const getBucketName = () => {
  if (IS_LOCAL) return 'assets-dev.goodparty.org'
  if (IS_PROD) return 'assets.goodparty.org'
  return 'assets-qa.goodparty.org'
}

export const uploadBlobToS3 = async ({ blobOrFile, fileType, fileName, folder }) => {
  const resp = await clientFetch(apiRoutes.user.files.generateSignedUploadUrl, {
    fileType,
    fileName,
    bucket: folder,
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
  const publicUrl = `https://${bucketName}/${folder}/${fileName}`
  return publicUrl
}

export const uploadFileToS3 = async (file, folder) => {
  const { name: fileName, type: fileType } = file
  return uploadBlobToS3({ blobOrFile: file, fileType, fileName, folder })
}
