'use client'
import { useFormData } from '@shared/hooks/useFormData'
import TextingComplianceForm from 'app/(user)/profile/texting-compliance/shared/TextingComplianceForm'
import isEmpty from 'validator/es/lib/isEmpty'
import { NumbersOnlyTextField } from '@shared/utils/NumbersOnlyTextField'

const initialFormState = {
  electionFilingLink: '',
  campaignCommitteeName: '',
  localTribeName: '',
  ein: '',
  phone: '',
  address: '',
  website: '',
  email: '',
  verifyInfo: false,
}

export const validatePinForm = (data) => {
  const { pin } = data
  return !isEmpty(pin) && pin.length === 6
}

export const TextingComplianceSubmitPinForm = () => {
  const { formData, handleChange } = useFormData()
  const { pin } = formData

  return (
    <TextingComplianceForm>
      <NumbersOnlyTextField
        {...{
          maxLength: 6,
          label: 'PIN',
          placeholder: '123456',
          value: pin,
          required: true,
          fullWidth: true,
          onChange: (e) => handleChange({ pin: e.target.value }),
        }}
      />
    </TextingComplianceForm>
  )
}
