'use client'
import H2 from '@shared/typography/H2'
import H5 from '@shared/typography/H5'
import TextingComplianceHeader from 'app/(user)/profile/texting-compliance/shared/TextingComplianceHeader'
import { FormDataProvider } from '@shared/hooks/useFormData'
import {
  TextingComplianceSubmitPinForm,
  validatePinForm,
} from 'app/(user)/profile/texting-compliance/submit-pin/components/TextingComplianceSubmitPinForm'

const initialFormState = {
  pin: '',
}

const TextingComplianceSubmitPinPage = () => {
  return (
    <div className="bg-white pt-2 md:pt-0">
      <TextingComplianceHeader>
        <H5 className="flex-1 text-center md:hidden">Enter your PIN</H5>
      </TextingComplianceHeader>

      <div className="mx-auto max-w-2xl px-4 py-6 md:px-8 md:py-8">
        <H2 className="mb-6 hidden md:block">Enter your PIN</H2>

        <FormDataProvider
          initialState={initialFormState}
          validator={validatePinForm}
        >
          <TextingComplianceSubmitPinForm />
        </FormDataProvider>
      </div>
    </div>
  )
}

export default TextingComplianceSubmitPinPage
