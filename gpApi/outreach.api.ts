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
  VoterFileFilterInOutreach,
} from './types/outreach.types'

/** API may return outreach at top level or under "outreach" */
type CreateOutreachRawResponse =
  | CreateOutreachResponse
  | { outreach?: CreateOutreachResponse }

function unwrapOutreachResponse(
  data: CreateOutreachRawResponse | null,
): CreateOutreachResponse | null {
  if (data == null || typeof data !== 'object') return null
  const raw =
    'outreach' in data && data.outreach != null ? data.outreach : data
  if (typeof raw !== 'object' || raw == null) return null
  const out = raw as CreateOutreachResponse
  return typeof out.id === 'number' ? out : null
}

/**
 * Create an outreach (POST /outreach). Returns the created Outreach with voterFileFilter.
 * Uses concrete types – no generic at call site.
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
  const resp = await clientFetch<CreateOutreachRawResponse>(
    apiRoutes.outreach.create,
    body,
  )
  const data = unwrapOutreachResponse(resp.data)
  return { ...resp, data }
}
