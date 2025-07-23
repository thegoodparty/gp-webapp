'use client'
import Button from '@shared/buttons/Button'
import H2 from '@shared/typography/H2'
import H5 from '@shared/typography/H5'
import TextingComplianceHeader from 'app/(user)/profile/texting-compliance/shared/TextingComplianceHeader'
import { useState } from 'react'
import isEmpty from 'validator/es/lib/isEmpty'
import { TextingComplianceSubmitPinForm } from 'app/(user)/profile/texting-compliance/submit-pin/components/TextingComplianceSubmitPinForm'

const initialFormState = {
  pin: '',
}

const isFilled = (v) => !isEmpty(v) && v.length === 6

const formValidators = {
  pin: isFilled,
}

const validateFormFields = (formData, formValidators) => {
  const fieldKeys = Object.keys(formData)
  return fieldKeys.every((key) => {
    const validator = formValidators[key]
    return validator ? validator(formData[key]) : true
  })
}

const TextingComplianceSubmitPinPage = () => {
  const [disableSubmit, setDisableSubmit] = useState(true)
  const handleFormOnChange = (formData) => {
    const shouldDisableSubmit = !validateFormFields(formData, formValidators)
    setDisableSubmit(shouldDisableSubmit)
  }
  return (
    <div className="min-h-screen bg-white pt-2 md:pt-0 md:min-h-0">
      <TextingComplianceHeader>
        <H5 className="flex-1 text-center md:hidden">Enter your PIN</H5>
      </TextingComplianceHeader>

      <div className="mx-auto max-w-2xl px-4 py-6 md:px-8 md:py-8">
        <H2 className="mb-6 hidden md:block">Enter your PIN</H2>

        <TextingComplianceSubmitPinForm
          {...{
            onChange: handleFormOnChange,
            initialFormData: initialFormState,
          }}
        />

        <div
          className="
            fixed
            bottom-0
            left-0
            right-0
            border-t
            border-gray-200
            bg-white
            p-4
            md:relative
            md:mt-8
            md:border-0
            md:p-0
          "
        >
          <div className="flex gap-4 justify-end">
            <Button
              color="primary"
              size="large"
              className="flex-1 md:flex-initial"
              disabled={disableSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextingComplianceSubmitPinPage
