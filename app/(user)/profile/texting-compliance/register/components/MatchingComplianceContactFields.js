import { FormControl, FormLabel } from '@mui/material'
import Checkbox from '@shared/inputs/Checkbox'

const MATCHING_COMPLIANCE_FIELDS_VALUE = {
  EMAIL: 'email',
  POSTAL_ADDRESS: 'postalAddress',
  PHONE: 'phone',
}

const MATCHING_COMPLIANCE_CONTACT_FIELDS = [
  {
    label: 'Address',
    value: MATCHING_COMPLIANCE_FIELDS_VALUE.POSTAL_ADDRESS,
  },
  {
    label: 'Email',
    value: MATCHING_COMPLIANCE_FIELDS_VALUE.EMAIL,
  },
  {
    label: 'Phone',
    value: MATCHING_COMPLIANCE_FIELDS_VALUE.PHONE,
  },
]

export const MatchingComplianceContactFields = ({
  value = [],
  onChange = (value) => {},
}) => {
  const handleOnChange = (e) =>
    onChange(
      e.currentTarget.checked
        ? [...value, e.currentTarget.value]
        : value.filter((v) => v !== e.currentTarget.value),
    )

  return (
    <FormControl
      className="m-3 text-black"
      component="fieldset"
      variant="standard"
    >
      <FormLabel
        {...{
          className: '!text-black',
          component: 'legend',
        }}
      >
        Which of these match your election filing?
      </FormLabel>
      {MATCHING_COMPLIANCE_CONTACT_FIELDS.map(
        ({ label, value: fieldValue }, index) => (
          <Checkbox
            {...{
              className: '!ml-3',
              index,
              label,
              value: fieldValue,
              onChange: handleOnChange,
            }}
          />
        ),
      )}
    </FormControl>
  )
}
