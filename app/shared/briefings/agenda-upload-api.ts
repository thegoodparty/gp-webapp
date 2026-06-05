/**
 * User-uploaded agenda client. Two submission paths share the same
 * `POST /v1/meetings/:date/briefing/agenda` finalize call; the difference
 * is whether the user gave us a URL or a file.
 *
 *   URL path:
 *     submitAgendaUrl(meetingDate, sourceUrl)
 *       → POST /agenda { source: 'URL', sourceUrl }
 *
 *   Upload path (three-step, mirrors attachments-api):
 *     submitAgendaFile(meetingDate, file)
 *       1. POST /agenda/presign  → { uploadId, uploadKey, uploadUrl }
 *       2. PUT bytes to uploadUrl with Content-Type: application/pdf
 *       3. POST /agenda { source: 'UPLOAD', uploadId, uploadKey }
 *
 * Bytes never pass through gp-api — the presigned URL puts them directly
 * into S3.
 */

import { clientRequest } from 'gpApi/typed-request'
import type { UserAgendaSubmitResponse } from 'gpApi/api-endpoints'

export const MAX_AGENDA_BYTES = 75 * 1024 * 1024

export class AgendaFileTooLargeError extends Error {
  constructor(public readonly byteSize: number) {
    super(`agenda_file_too_large:${byteSize}`)
    this.name = 'AgendaFileTooLargeError'
  }
}

export class AgendaFileWrongTypeError extends Error {
  constructor(public readonly mimeType: string) {
    super(`agenda_file_wrong_type:${mimeType}`)
    this.name = 'AgendaFileWrongTypeError'
  }
}

const PDF_MIME = 'application/pdf'

const looksLikePdf = (file: File): boolean => {
  if (file.type === PDF_MIME) return true
  // Some Android pickers report empty file.type for PDFs — accept by
  // extension when the MIME is missing.
  if (file.type === '') return file.name.toLowerCase().endsWith('.pdf')
  return false
}

export const submitAgendaUrl = async (
  meetingDate: string,
  sourceUrl: string,
): Promise<UserAgendaSubmitResponse> => {
  const { data } = await clientRequest(
    'POST /v1/meetings/:date/briefing/agenda',
    { date: meetingDate, source: 'URL', sourceUrl },
  )
  return data
}

export const submitAgendaFile = async (
  meetingDate: string,
  file: File,
): Promise<UserAgendaSubmitResponse> => {
  if (!looksLikePdf(file)) {
    throw new AgendaFileWrongTypeError(file.type)
  }
  if (file.size > MAX_AGENDA_BYTES) {
    throw new AgendaFileTooLargeError(file.size)
  }

  const { data: presign } = await clientRequest(
    'POST /v1/meetings/:date/briefing/agenda/presign',
    {
      date: meetingDate,
      contentType: PDF_MIME,
      byteSize: file.size,
    },
  )

  const putResponse = await fetch(presign.uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': PDF_MIME },
  })
  if (!putResponse.ok) {
    throw new Error(`s3_upload_failed:${putResponse.status}`)
  }

  // Note: we DON'T send presign.uploadKey here even though the presign
  // endpoint returns it. gp-api reconstructs the S3 key server-side from
  // electedOffice + meetingDate + uploadId; sending a client-supplied key
  // would be an IDOR vector and is rejected by the schema.
  const { data } = await clientRequest(
    'POST /v1/meetings/:date/briefing/agenda',
    {
      date: meetingDate,
      source: 'UPLOAD',
      uploadId: presign.uploadId,
    },
  )
  return data
}
