import { clientFetch } from './clientFetch'
import { apiRoutes } from './routes'
import type { ApiResponse } from './clientFetch'
import type {
  CreateOutreachPayload,
  CreateOutreachResponse,
} from './types/outreach.types'

export type {
  CreateOutreachPayload,
  CreateOutreachResponse,
  OutreachType,
} from './types/outreach.types'

/**
 * Create an outreach (POST /outreach). Returns the created Outreach with voterFileFilter.
 * Pass payload + optional image; body is built as FormData when image is present, else JSON.
 */
export async function createOutreach(
  payload: CreateOutreachPayload,
  image: File | null = null,
): Promise<ApiResponse<CreateOutreachResponse | null>> {
  if (image) {
    const formData = new FormData()
    formData.append('data', JSON.stringify(payload))
    formData.append('file', image)
    return clientFetch<CreateOutreachResponse>(
      apiRoutes.outreach.create,
      formData,
    )
  }
  return clientFetch<CreateOutreachResponse>(apiRoutes.outreach.create, payload)
}
