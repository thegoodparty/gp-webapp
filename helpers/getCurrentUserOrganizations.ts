import { cache } from 'react'
import { serverRequest } from 'gpApi/server-request'
import type { Organization } from 'gpApi/api-endpoints'

/**
 * Request-scoped fetch of the signed-in user's organizations.
 * Dedupes with React `cache()` when multiple server components call it in the same render.
 */
export const getCurrentUserOrganizations = cache(
  async (): Promise<Organization[]> => {
    const resp = await serverRequest(
      'GET /v1/organizations',
      {},
      { ignoreResponseError: true },
    )
    return resp.ok ? resp.data.organizations : []
  },
)
