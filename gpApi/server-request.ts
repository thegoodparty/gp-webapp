import { API_ROOT } from 'appEnv'
import { cookies } from 'next/headers'
import { createRequest } from './typed-request'
import { getServerToken } from 'helpers/userServerHelper'
import {
  ORG_SLUG_COOKIE,
  ORG_SLUG_HEADER,
} from '@shared/organizations/constants'

/** Use this for server-side requests. */
export const serverRequest = createRequest(async (opts) => {
  const token = await getServerToken()
  opts.headers = { ...opts.headers, Authorization: `Bearer ${token}` }
  opts.baseURL = API_ROOT

  const cookieStore = await cookies()
  const orgSlug = cookieStore.get(ORG_SLUG_COOKIE)?.value
  if (orgSlug) {
    opts.headers = { ...opts.headers, [ORG_SLUG_HEADER]: orgSlug }
  }

  return opts
})
