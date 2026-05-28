import { clientRequest } from 'gpApi/typed-request'
import type {
  ApiArtifactFeedback,
  ApiArtifactFeedbackKind,
} from 'gpApi/api-endpoints'

export type ArtifactFeedbackKind = ApiArtifactFeedbackKind

export interface ArtifactFeedback {
  id: string
  organizationSlug: string
  submitterUserId: number
  artifactId: string
  feedback: ArtifactFeedbackKind
  /** Optional free-text the submitter attached. `null` if none. */
  comment: string | null
  createdAt: string
  updatedAt: string
}

function fromApi(row: ApiArtifactFeedback): ArtifactFeedback {
  return {
    id: row.id,
    organizationSlug: row.organization_slug,
    submitterUserId: row.submitter_user_id,
    artifactId: row.artifact_id,
    feedback: row.feedback,
    comment: row.comment,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export const briefingFeedbackApi = {
  async list(meetingDate: string): Promise<ArtifactFeedback[]> {
    const res = await clientRequest(
      'GET /v1/meetings/:date/briefing/feedback',
      { date: meetingDate },
    )
    return res.data.feedback.map(fromApi)
  },

  async set(
    meetingDate: string,
    itemId: string,
    feedback: ArtifactFeedbackKind,
    // `undefined` (the default) means "leave any existing comment alone".
    // Pass `null` to clear, a string to set/replace. Mirrors the API
    // contract: `comment` is optional on the request body.
    comment?: string | null,
  ): Promise<ArtifactFeedback> {
    const res = await clientRequest(
      'PUT /v1/meetings/:date/briefing/items/:itemId/feedback',
      {
        date: meetingDate,
        itemId,
        feedback,
        ...(comment === undefined ? {} : { comment }),
      },
    )
    return fromApi(res.data)
  },

  async clear(meetingDate: string, itemId: string): Promise<void> {
    await clientRequest(
      'DELETE /v1/meetings/:date/briefing/items/:itemId/feedback',
      { date: meetingDate, itemId },
    )
  },
}
