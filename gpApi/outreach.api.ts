import { clientFetch } from './clientFetch'
import { apiRoutes } from './routes'
import { packageFormData } from 'helpers/packageFormData'
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
 * API returns the outreach object at the top level.
 */
export async function createOutreach(
  payload: CreateOutreachPayload | FormData,
  image: File | null = null,
): Promise<ApiResponse<CreateOutreachResponse | null>> {
  type FormDataInput = Parameters<typeof packageFormData>[0]
  const body =
    image != null && !(payload instanceof FormData)
      ? packageFormData((payload as unknown) as FormDataInput, image)
      : payload
  const resp = await clientFetch<CreateOutreachResponse>(
    apiRoutes.outreach.create,
    body,
  )
  return { ...resp, data: resp.data }
}
