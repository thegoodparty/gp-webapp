'use client'
import { useFormData } from '@shared/hooks/useFormData'
import TextingComplianceForm from 'app/(user)/profile/texting-compliance/shared/TextingComplianceForm'
import isEmpty from 'validator/es/lib/isEmpty'
import { NumbersOnlyTextField } from '@shared/utils/NumbersOnlyTextField'
// <<<<<<< HEAD
import TextingComplianceFooter from 'app/(user)/profile/texting-compliance/shared/TextingComplianceFooter'
import { TextingComplianceSubmitButton } from 'app/(user)/profile/texting-compliance/shared/TextingComplianceSubmitButton'
import { validateRegistrationForm } from 'app/(user)/profile/texting-compliance/register/components/TextingComplianceRegistrationForm'

{
  /*=======*/
}
{
  /*>>>>>>> origin/develop*/
}

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

// <<<<<<< HEAD
export const TextingComplianceSubmitPinForm = ({
  onSubmit = (formData) => {},
  loading = false,
}) => {
  // =======
  // export const TextingComplianceSubmitPinForm = () => {
  // >>>>>>> origin/develop
  const { formData, handleChange } = useFormData()
  const { pin } = formData

  return (
    // <<<<<<< HEAD
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
          }}
        />
      </TextingComplianceForm>
      <TextingComplianceFooter>
        <TextingComplianceSubmitButton
          {...{
            onClick: () => onSubmit(formData),
            loading,
            isValid: validateRegistrationForm(formData),
          }}
        />
      </TextingComplianceFooter>
    </>
    // =======
    //     <TextingComplianceForm>
    //       <NumbersOnlyTextField
    //         {...{
    //           maxLength: 6,
    //           label: 'PIN',
    //           placeholder: '123456',
    //           value: pin,
    //           required: true,
    //           fullWidth: true,
    //           onChange: (e) => handleChange({ pin: e.target.value }),
    //         }}
    //       />
    //     </TextingComplianceForm>
    // >>>>>>> origin/develop
  )
}
