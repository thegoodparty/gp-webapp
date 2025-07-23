'use client'
import { useFormData } from '@shared/hooks/useFormData'
import TextinComplianceForm from 'app/(user)/profile/texting-compliance/shared/TextinComplianceForm'
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
    <TextinComplianceForm>
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
    </TextinComplianceForm>
  )
}
