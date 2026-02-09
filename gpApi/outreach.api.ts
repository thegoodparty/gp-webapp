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

/** API may return outreach at top level or under "outreach" */
type CreateOutreachRawResponse =
  | CreateOutreachResponse
  | { outreach?: CreateOutreachResponse }

/** API may return id as number or string; normalize to number for CreateOutreachResponse. */
function normalizeOutreachId(id: unknown): number | null {
  if (typeof id === 'number' && Number.isFinite(id)) return id
  if (typeof id === 'string') {
    const n = Number(id)
    if (Number.isFinite(n)) return n
  }
  return null
}

function unwrapOutreachResponse(
  data: CreateOutreachRawResponse | null,
): CreateOutreachResponse | null {
  if (data == null || typeof data !== 'object') return null
  const raw =
    'outreach' in data && data.outreach != null ? data.outreach : data
  if (typeof raw !== 'object' || raw == null) return null
  const out = raw as Record<string, unknown> & { id: unknown }
  const id = normalizeOutreachId(out.id)
  if (id == null) return null
  return { ...out, id } as CreateOutreachResponse
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
