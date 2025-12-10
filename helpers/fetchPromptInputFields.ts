import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'

interface PromptInputFieldsContent {
  [key: string]: unknown
}

export const fetchPromptInputFields = async (
  subKey: string,
): Promise<unknown> => {
  const resp = await clientFetch<PromptInputFieldsContent>(
    apiRoutes.content.getByType,
    {
      type: 'promptInputFields',
    },
    { revalidate: 3600 },
  )
  const content = resp.data
  return content[subKey]
}
