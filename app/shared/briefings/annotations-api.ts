/**
 * Real AnnotationsClient that talks to gp-api.
 *
 * Backend returns snake_case; this layer translates to and from the
 * camelCase shape that the rest of the frontend uses (defined in
 * @shared/briefings/types). When the contracts package gets published for
 * the webapp to consume, these translations can be replaced with direct
 * re-exports.
 */

import { clientRequest } from 'gpApi/typed-request'
import type {
  ApiAnnotation,
  ApiAnnotationAnchorInput,
  ApiCreateAnnotationInput,
} from 'gpApi/api-endpoints'
import type {
  Annotation,
  AnnotationAnchor,
  CreateAnnotationInput,
} from './types'
import type { AnnotationsClient } from './annotations-client'

function apiAnchor(anchor: AnnotationAnchor): ApiAnnotationAnchorInput {
  return {
    json_path: anchor.jsonPath,
    start: anchor.start,
    end: anchor.end,
  }
}

function apiInput(input: CreateAnnotationInput): ApiCreateAnnotationInput {
  if (input.kind === 'note') {
    return {
      kind: 'note',
      anchor: apiAnchor(input.anchor),
      payload: { body: input.payload.body },
    }
  }
  if (input.kind === 'bug_report') {
    return {
      kind: 'bug_report',
      anchor: apiAnchor(input.anchor),
      payload: { description: input.payload.description },
    }
  }
  if (input.kind === 'review') {
    return {
      kind: 'review',
      anchor: apiAnchor(input.anchor),
      payload: { body: input.payload.body },
    }
  }
  // Chat kind is rejected by the API; surface a clear error instead of
  // sending a request the server will refuse.
  throw new Error('chat_annotations_not_supported_yet')
}

function fromApi(row: ApiAnnotation): Annotation {
  const result: Annotation = {
    id: row.id,
    kind: row.kind,
    resourceType: row.resource_type,
    resourceId: row.resource_id,
    authorUserId: row.author_user_id,
    jsonPath: row.json_path,
    start: row.start,
    end: row.end,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
  if (row.note) {
    result.note = {
      id: row.note.id,
      body: row.note.body,
      attachments: row.note.attachments.map((a) => ({
        id: a.id,
        fileName: a.file_name,
        mimeType: a.mime_type,
        sizeBytes: a.size_bytes,
        ocrStatus: a.ocr_status,
        ocrText: a.ocr_text,
        ocrError: a.ocr_error,
        ocrCompletedAt: a.ocr_completed_at,
        createdAt: a.created_at,
      })),
      createdAt: row.note.created_at,
      updatedAt: row.note.updated_at,
    }
  }
  if (row.bug_report) {
    result.bugReport = {
      id: row.bug_report.id,
      description: row.bug_report.description,
      submittedAt: row.bug_report.submitted_at,
    }
  }
  if (row.chat) {
    result.chat = {
      id: row.chat.id,
      createdAt: row.chat.created_at,
    }
  }
  if (row.review) {
    result.review = {
      id: row.review.id,
      body: row.review.body,
      reviewer_email: row.review.reviewer_email,
      created_at: row.review.created_at,
      updated_at: row.review.updated_at,
    }
  }
  return result
}

export const annotationsApi: AnnotationsClient = {
  async list(meetingDate, kinds) {
    const res = await clientRequest(
      'GET /v1/meetings/:date/briefing/annotations',
      {
        date: meetingDate,
        ...(kinds && kinds.length > 0 ? { kinds: kinds.join(',') } : {}),
      },
    )
    return res.data.annotations.map(fromApi)
  },

  async create(meetingDate, input) {
    const res = await clientRequest(
      'POST /v1/meetings/:date/briefing/annotations',
      { date: meetingDate, ...apiInput(input) },
    )
    return fromApi(res.data)
  },

  async updateNote(annotationId, body) {
    const res = await clientRequest('PUT /v1/annotations/:annotationId/note', {
      annotationId,
      body,
    })
    return fromApi(res.data)
  },

  async updateReview(annotationId, body) {
    const res = await clientRequest(
      'PUT /v1/annotations/:annotationId/review',
      { annotationId, body },
    )
    return fromApi(res.data)
  },

  async delete(annotationId) {
    await clientRequest('DELETE /v1/annotations/:annotationId', {
      annotationId,
    })
  },
}
