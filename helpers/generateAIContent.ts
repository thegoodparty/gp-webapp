import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

enum GenerationStatus {
  processing = 'processing',
  completed = 'completed',
}

type AiContentInputValues = Record<
  string,
  string | boolean | number | undefined
>

type AiContentData = {
  name: string
  content: string
  updatedAt: number
  inputValues?: AiContentInputValues
}

interface GenerateAIContentResponse {
  status: GenerationStatus
  chatResponse: AiContentData
}

export const generateAIContent = async (
  key: string,
  chat: string | Record<string, unknown>,
  inputValues: Record<string, unknown> = {},
): Promise<GenerateAIContentResponse | false> => {
  try {
    const resp = await clientFetch<GenerateAIContentResponse>(
      apiRoutes.campaign.ai.create,
      {
        key,
        chat,
        inputValues,
      },
    )
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}
