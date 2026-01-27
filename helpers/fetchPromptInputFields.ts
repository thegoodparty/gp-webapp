import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'

export interface PromptInputField {
  title: string
  helperText?: string
  isDate?: boolean
}

type PromptInputFieldsContent = Partial<Record<string, PromptInputField[]>>

export const fetchPromptInputFields = async (
  subKey: string,
): Promise<PromptInputField[] | undefined> => {
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
