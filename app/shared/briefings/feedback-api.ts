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
  ): Promise<ArtifactFeedback> {
    const res = await clientRequest(
      'PUT /v1/meetings/:date/briefing/items/:itemId/feedback',
      { date: meetingDate, itemId, feedback },
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
