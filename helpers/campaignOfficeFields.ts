type OfficeFieldKey =
  | 'office'
  | 'state'
  | 'electionDate'
  | 'primaryElectionDate'
  | 'officeTermLength'

interface OfficeInputField {
  key: OfficeFieldKey
  label: string
  type: 'text' | 'date'
}

export interface OfficeFieldState {
  office: string
  state: string
  electionDate: string
  primaryElectionDate: string
  officeTermLength: string
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
