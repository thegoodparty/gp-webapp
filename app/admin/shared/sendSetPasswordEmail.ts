import { clientFetch, ApiResponse } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export const sendSetPasswordEmail = async (
  userId: string | number,
): Promise<ApiResponse<{ success: boolean }> | false> => {
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
