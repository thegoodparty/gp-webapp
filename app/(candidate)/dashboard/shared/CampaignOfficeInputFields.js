import { OFFICE_INPUT_FIELDS } from 'helpers/campaignOfficeFields'
import TextField from '@shared/inputs/TextField'
import { dateUsHelper } from 'helpers/dateHelper'

export const CampaignOfficeInputFields = ({
  values,
  gridLayout = true,
  fieldWrapClassName = '',
}) =>
  OFFICE_INPUT_FIELDS.filter(
    ({ key }) => key !== 'primaryElectionDate' || values[key],
  ).map((field) => (
    <div
      key={field.key}
      className={
        gridLayout
          ? `col-span-12 md:col-span-6 mb-6 ${fieldWrapClassName}`
          : `mb-6 ${fieldWrapClassName}`
      }
    >
      <TextField
        field={field}
        label={field.label}
        value={
          field.type === 'date'
            ? dateUsHelper(values[field.key])
            : values[field.key]
        }
        disabled
        fullWidth
      />
    </div>
  ))
