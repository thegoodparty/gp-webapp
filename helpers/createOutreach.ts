import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { packageFormData } from 'helpers/packageFormData'

interface OutreachResponse {
  id: string
  [key: string]: unknown
}

type FormDataValue =
  | string
  | number
  | boolean
  | Date
  | object
  | null
  | undefined

export const createOutreach = async (
  outreachData: Record<string, unknown>,
  image: File | null = null,
): Promise<OutreachResponse | null> => {
  const formData = image
    ? packageFormData(outreachData as Record<string, FormDataValue>, image)
    : null
  try {
    const resp = await clientFetch<OutreachResponse>(
      apiRoutes.outreach.create,
      formData || outreachData,
    )
    if (!resp.ok) {
      console.error('Error creating outreach:', resp.statusText)
      return null
    }
    return resp.data
  } catch (e) {
    console.error('error creating outreach', e)
    return null
  }
}
