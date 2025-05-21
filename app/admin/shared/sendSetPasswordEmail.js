import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export const sendSetPasswordEmail = async (userId) => {
  try {
    const payload = {
      userId,
    }
    return await clientFetch(
      apiRoutes.authentication.sendSetPasswordEmail,
      payload,
    )
  } catch (e) {
    console.error('error', e)
    return false
  }
}
