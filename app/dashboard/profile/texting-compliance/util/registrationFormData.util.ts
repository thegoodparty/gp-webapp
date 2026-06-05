import { clientFetch } from 'gpApi/clientFetch'
import type { ApiRoute } from 'gpApi/routes'
import type { FormDataState } from '@shared/hooks/useFormData'
import { mapFormData } from 'app/dashboard/profile/texting-compliance/util/mapFormData.util'

export interface RegistrationFormData {
  electionFilingLink: string
  campaignCommitteeName: string
  officeLevel: string
  ein: string
  phone: string
  address: { formatted_address: string; place_id: string }
  website: string
  email: string
  fecCommitteeId?: string
  committeeType?: string
}

export const isAddressValue = (
  value: FormDataState[keyof FormDataState] | undefined,
): value is RegistrationFormData['address'] =>
  Boolean(
    value &&
    typeof value === 'object' &&
    'formatted_address' in value &&
    'place_id' in value,
  )

export const toRegistrationFormData = (
  formData: FormDataState,
): RegistrationFormData => ({
  electionFilingLink: String(formData.electionFilingLink || ''),
  campaignCommitteeName: String(formData.campaignCommitteeName || ''),
  officeLevel: String(formData.officeLevel || ''),
  ein: String(formData.ein || ''),
  phone: String(formData.phone || ''),
  address: isAddressValue(formData.address)
    ? formData.address
    : { formatted_address: '', place_id: '' },
  website: String(formData.website || ''),
  email: String(formData.email || ''),
  fecCommitteeId: formData.fecCommitteeId
    ? String(formData.fecCommitteeId)
    : undefined,
  committeeType: formData.committeeType
    ? String(formData.committeeType)
    : undefined,
})

export const submitTcrCompliance = async (
  route: ApiRoute,
  formData: RegistrationFormData,
  errorMessage = 'Failed to submit TCR compliance',
): Promise<unknown> => {
  const mappedData = mapFormData(formData)
  const response = await clientFetch(route, mappedData)
  if (!response.ok) {
    throw new Error(errorMessage)
  }
  return response.data
}
