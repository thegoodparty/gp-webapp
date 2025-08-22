import { FormControl, FormLabel } from '@mui/material'
import Checkbox from '@shared/inputs/Checkbox'

export const MATCHING_COMPLIANCE_FIELDS_VALUE = {
  PHONE: 'phone',
  EMAIL: 'email',
  POSTAL_ADDRESS: 'postalAddress',
}

export const MATCHING_COMPLIANCE_CONTACT_FIELDS = [
  {
    label: 'Phone',
    value: MATCHING_COMPLIANCE_FIELDS_VALUE.PHONE,
  },
  {
    label: 'Email',
    value: MATCHING_COMPLIANCE_FIELDS_VALUE.EMAIL,
  },
  {
    label: 'Address',
    value: MATCHING_COMPLIANCE_FIELDS_VALUE.POSTAL_ADDRESS,
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
            key={fieldValue}
            {...{
              className: '!ml-3',
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
