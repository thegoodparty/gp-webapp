import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

const saveToken = async (token: string): Promise<{ ok: boolean }> => {
  const resp = await clientFetch(apiRoutes.setCookie, { token })
  return resp.data
}

export default saveToken

