import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

interface GenerateAIContentResponse {
  [key: string]: unknown
}

export const generateAIContent = async (
  key: string,
  chat: string | Record<string, unknown>,
  inputValues: Record<string, unknown> = {},
): Promise<GenerateAIContentResponse | false> => {
  try {
    const resp = await clientFetch<GenerateAIContentResponse>(apiRoutes.campaign.ai.create, {
      key,
      chat,
      inputValues,
    })
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}

