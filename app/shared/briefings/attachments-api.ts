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

const EXTENSION_MIME: Record<string, string> = {
  pdf: 'application/pdf',
  txt: 'text/plain',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
}

/**
 * `file.type` can be empty on some Android / Linux file pickers (notably for
 * .docx and .txt). The presign endpoint enforces a MIME whitelist, so an
 * empty value would 400. Fall back to extension-based detection.
 */
export const resolveMimeType = (file: File): string => {
  if (file.type) return file.type
  const dot = file.name.lastIndexOf('.')
  if (dot < 0) return ''
  const ext = file.name.slice(dot + 1).toLowerCase()
  return EXTENSION_MIME[ext] ?? ''
}

/**
 * Uploads `file` against `annotationId` and resolves once the server has
 * accepted the completion and enqueued OCR. Throws on any step's failure.
 */
export const uploadAttachment = async (
  input: UploadAttachmentInput,
): Promise<UploadAttachmentResult> => {
  const { annotationId, file } = input
  const mimeType = resolveMimeType(file)

  const { data: presign } = await clientRequest(
    'POST /v1/annotations/:annotationId/note/attachments/presign',
    {
      annotationId,
      file_name: file.name,
      mime_type: mimeType,
      size_bytes: file.size,
    },
  )

  const putResponse = await fetch(presign.upload_url, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': mimeType },
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

export type AttachmentDownloadUrl = {
  url: string
  expiresAt: string
}

/**
 * Fetches a short-lived presigned S3 GET URL for an attachment. Used
 * for `<img src>` on image thumbnails and `window.open` on document
 * attachments — bytes never pass through gp-api. URL is good for ~15
 * min; callers should re-fetch if `expiresAt` is in the past.
 */
export const getAttachmentDownloadUrl = async (input: {
  annotationId: string
  attachmentId: string
}): Promise<AttachmentDownloadUrl> => {
  const { data } = await clientRequest(
    'GET /v1/annotations/:annotationId/note/attachments/:attachmentId/download-url',
    input,
  )
  return { url: data.download_url, expiresAt: data.expires_at }
}
