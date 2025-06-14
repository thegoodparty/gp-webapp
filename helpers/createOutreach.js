import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

import { packageFormData } from 'helpers/packageFormData'

export const createOutreach = async (outreachData, image = null) => {
  const formData = image && packageFormData(outreachData, image)
  try {
    const resp = await clientFetch(
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
