/**
 * Interface for the annotations API client.
 *
 * Production implementation will call gp-api endpoints under
 * /v1/meeting-briefings/:briefingId/annotations. During dev, the localStorage
 * stub in annotations-stub.ts satisfies the same interface so components do not
 * need to change when the real API lands.
 */

import type { Annotation, CreateAnnotationInput } from './types'

export interface AnnotationsClient {
  list(briefingId: string): Promise<Annotation[]>
  create(briefingId: string, input: CreateAnnotationInput): Promise<Annotation>
  updateNote(annotationId: string, body: string): Promise<Annotation>
  delete(annotationId: string): Promise<void>
}
