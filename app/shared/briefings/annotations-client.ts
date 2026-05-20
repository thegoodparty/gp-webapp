/**
 * Interface for the annotations API client.
 *
 * Production implementation calls gp-api endpoints under
 * `/v1/meetings/:date/briefing/annotations` and `/v1/annotations/:id`.
 * Briefings are addressed by the meeting date string (YYYY-MM-DD), the
 * same identifier used by `GET /v1/meetings/:date/briefing`.
 *
 * The localStorage stub in annotations-stub.ts satisfies the same
 * interface so components do not need to change when toggling.
 */

import type { Annotation, CreateAnnotationInput } from './types'

export interface AnnotationsClient {
  list(meetingDate: string): Promise<Annotation[]>
  create(meetingDate: string, input: CreateAnnotationInput): Promise<Annotation>
  updateNote(annotationId: string, body: string): Promise<Annotation>
  delete(annotationId: string): Promise<void>
}
