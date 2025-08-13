'use client'
import { useFormData } from '@shared/hooks/useFormData'
import TextingComplianceForm from 'app/(user)/profile/texting-compliance/shared/TextingComplianceForm'
import isEmpty from 'validator/es/lib/isEmpty'
import { NumbersOnlyTextField } from '@shared/utils/NumbersOnlyTextField'
import TextingComplianceFooter from 'app/(user)/profile/texting-compliance/shared/TextingComplianceFooter'
import { TextingComplianceSubmitButton } from 'app/(user)/profile/texting-compliance/shared/TextingComplianceSubmitButton'

export const validatePinForm = (data) => {
  const { pin } = data
  return {
    isValid: !isEmpty(pin) && pin.length === 6,
  }
}

export const TextingComplianceSubmitPinForm = ({
  onSubmit = (formData) => {},
  loading = false,
  error = null,
}) => {
  const { formData, handleChange } = useFormData()
  const { pin } = formData
  const { isValid } = validatePinForm(formData)

  const handleSubmit = () => onSubmit({ ...formData })

  return (
    <>
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
            error: Boolean(error),
            ...(error ? { helperText: error } : {}),
          }}
        />
      </TextingComplianceForm>
      <TextingComplianceFooter>
        <TextingComplianceSubmitButton
          {...{
            onClick: handleSubmit,
            loading,
            isValid,
          }}
        />
      </TextingComplianceFooter>
    </>
  )
}
