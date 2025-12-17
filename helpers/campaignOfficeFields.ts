interface OfficeInputField {
  key: string
  label: string
  type: 'text' | 'date'
}

export const OFFICE_INPUT_FIELDS: OfficeInputField[] = [
  {
    key: 'office',
    label: 'Office',
    type: 'text',
  },

  {
    key: 'state',
    label: 'State',
    type: 'text',
  },

  {
    key: 'electionDate',
    label: 'Date of Election',
    type: 'date',
  },
  {
    key: 'primaryElectionDate',
    label: 'Date of Primary Election',
    type: 'date',
  },
  {
    key: 'officeTermLength',
    label: 'Term Length',
    type: 'text',
  },
]

interface CampaignDetails {
  office?: string
  otherOffice?: string
  state?: string
  electionDate?: string
  primaryElectionDate?: string
  officeTermLength?: string
  [key: string]: string | undefined
}

export const campaignOfficeFields = (campaignDetails: CampaignDetails = {}): Record<string, string> => {
  const fieldsAsMap = OFFICE_INPUT_FIELDS.reduce(
    (accumulator, field) => ({
      ...accumulator,
      [field.key]: campaignDetails[field.key] || '',
    }),
    {} as Record<string, string>,
  )
  fieldsAsMap.office =
    campaignDetails.otherOffice || campaignDetails.office || ''
  return fieldsAsMap
}

