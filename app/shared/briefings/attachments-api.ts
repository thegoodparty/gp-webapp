/**
 * Attachment lifecycle client. Encapsulates the three-step upload flow:
 *   1. POST /presign  → server creates a pending row + signed S3 PUT URL
 *   2. PUT file to S3 directly (no gp-api in the loop)
 *   3. POST /complete → server confirms upload and enqueues OCR
 *
 * Bytes never pass through gp-api, which is why we use presigned URLs in the
 * first place. The OCR job runs async and the polled annotations response
 * surfaces ocr_status updates back to the UI.
 */

import { clientRequest } from 'gpApi/typed-request'

export type UploadAttachmentInput = {
  annotationId: string
  file: File
}

export type UploadAttachmentResult = {
  attachmentId: string
}

/**
 * Uploads `file` against `annotationId` and resolves once the server has
 * accepted the completion and enqueued OCR. Throws on any step's failure.
 */
export const uploadAttachment = async (
  input: UploadAttachmentInput,
): Promise<UploadAttachmentResult> => {
  const { annotationId, file } = input

  const { data: presign } = await clientRequest(
    'POST /v1/annotations/:annotationId/note/attachments/presign',
    {
      annotationId,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
    },
  )

  const putResponse = await fetch(presign.upload_url, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  })
  if (!putResponse.ok) {
    throw new Error(`s3_upload_failed:${putResponse.status}`)
  }

  await clientRequest(
    'POST /v1/annotations/:annotationId/note/attachments/:attachmentId/complete',
    { annotationId, attachmentId: presign.attachment_id },
  )

  return { attachmentId: presign.attachment_id }
}

export const deleteAttachment = async (input: {
  annotationId: string
  attachmentId: string
}): Promise<void> => {
  await clientRequest(
    'DELETE /v1/annotations/:annotationId/note/attachments/:attachmentId',
    input,
  )
}
