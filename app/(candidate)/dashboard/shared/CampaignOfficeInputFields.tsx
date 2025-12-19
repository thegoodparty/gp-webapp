import { OFFICE_INPUT_FIELDS } from 'helpers/campaignOfficeFields'
import TextField from '@shared/inputs/TextField'
import { dateUsHelper } from 'helpers/dateHelper'

interface CampaignOfficeValues {
  office?: string
  state?: string
  electionDate?: string | Date
  primaryElectionDate?: string | Date
  officeTermLength?: string
}

interface CampaignOfficeInputFieldsProps {
  values: CampaignOfficeValues
  gridLayout?: boolean
  fieldWrapClassName?: string
}

const getFieldValue = (values: CampaignOfficeValues, key: string): string | Date | undefined => {
  if (key === 'office') return values.office
  if (key === 'state') return values.state
  if (key === 'electionDate') return values.electionDate
  if (key === 'primaryElectionDate') return values.primaryElectionDate
  if (key === 'officeTermLength') return values.officeTermLength
  return undefined
}

export const CampaignOfficeInputFields = ({
  values,
  gridLayout = true,
  fieldWrapClassName = '',
}: CampaignOfficeInputFieldsProps): React.JSX.Element[] =>
  OFFICE_INPUT_FIELDS.filter(
    ({ key }) => key !== 'primaryElectionDate' || getFieldValue(values, key),
  ).map((field) => {
    const fieldValue = getFieldValue(values, field.key)
    return (
      <div
        key={field.key}
        className={
          gridLayout
            ? `col-span-12 md:col-span-6 mb-6 ${fieldWrapClassName}`
            : `mb-6 ${fieldWrapClassName}`
        }
      >
        <TextField
          label={field.label}
          value={
            field.type === 'date'
              ? dateUsHelper(String(fieldValue || ''))
              : String(fieldValue || '')
          }
          disabled
          fullWidth
        />
      </div>
    )
  })
