import { API_ROOT } from 'appEnv'
import { createRequest } from './typed-request'
import { getServerToken } from 'helpers/userServerHelper'

/** Use this for server-side requests. */
export const serverRequest = createRequest(async (opts) => {
  const token = await getServerToken()
  opts.headers = { ...opts.headers, Authorization: `Bearer ${token}` }
  opts.baseURL = API_ROOT
  return opts
})
