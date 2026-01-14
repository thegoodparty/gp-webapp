'use client'
import { useFormData } from '@shared/hooks/useFormData'
import TextingComplianceForm from 'app/(user)/profile/texting-compliance/shared/TextingComplianceForm'
import isEmpty from 'validator/es/lib/isEmpty'
import { NumbersOnlyTextField } from '@shared/utils/NumbersOnlyTextField'
import TextingComplianceFooter from 'app/(user)/profile/texting-compliance/shared/TextingComplianceFooter'
import { TextingComplianceSubmitButton } from 'app/(user)/profile/texting-compliance/shared/TextingComplianceSubmitButton'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

export type PinFormData = Partial<Record<string, string | number | boolean>> & {
  pin: string
}

interface ValidationResult {
  validations: Partial<Record<string, string>>
  isValid: boolean
}

export const validatePinForm = (data: PinFormData): ValidationResult => {
  const { pin } = data
  return {
    validations: {},
    isValid: !isEmpty(pin) && pin.length === 6,
  }
}

interface TextingComplianceSubmitPinFormProps {
  onSubmit?: (formData: PinFormData) => void
  loading?: boolean
  error?: string | null
}

export const TextingComplianceSubmitPinForm = ({
  onSubmit = () => {},
  loading = false,
  error = null,
}: TextingComplianceSubmitPinFormProps): React.JSX.Element => {
  const { formData, handleChange } = useFormData()
  const pin = typeof formData.pin === 'string' ? formData.pin : ''
  const { isValid } = validatePinForm({ pin })

  const handleSubmit = () => {
    trackEvent(EVENTS.Outreach.P2PCompliance.CvPinFormSubmitted, {
      source: 'compliance_flow'
    })
    return onSubmit({ pin })
  }

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
