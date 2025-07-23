'use client'
import Button from '@shared/buttons/Button'
import H2 from '@shared/typography/H2'
import H5 from '@shared/typography/H5'
import Body2 from '@shared/typography/Body2'
import NewInfoAlert from '@shared/alerts/NewInfoAlert'
import TextingComplianceHeader from './TextingComplianceHeader'
import TextingComplianceRegistrationForm from './TextingComplianceRegistrationForm'
import { useState } from 'react'
import isURL from 'validator/es/lib/isURL'
import isEmpty from 'validator/es/lib/isEmpty'
import { isValidEIN } from '@shared/inputs/IsValidEIN'
import isMobilePhone from 'validator/es/lib/isMobilePhone'
import isFQDN from 'validator/es/lib/isFQDN'
import isEmail from 'validator/es/lib/isEmail'

const initialFormState = {
  electionFilingLink: 'https://elections.example.com/filing123',
  campaignCommitteeName: 'Friends of Democracy',
  localTribeName: 'Cherokee Nation',
  ein: '12-3456789',
  phone: '(805) 550-3465',
  address: '123 Main St, Springfield, IL 62701',
  website: 'https://friendsofdemocracy.org',
  email: 'contact@friendsofdemocracy.org',
}

const isFilled = (v) => !isEmpty(v) && v.length >= 2

const formValidators = {
  electionFilingLink: (v) => isURL(v),
  campaignCommitteeName: isFilled,
  localTribeName: isFilled,
  ein: isValidEIN,
  phone: (v) => isMobilePhone(v, 'en-US'),
  // TODO: We should do idiomatic "recommended address" validation flow here, and
  //  elsewhere, to have higher degree of confidence that the address entered is
  //  valid
  address: isFilled,
  website: (v) => isFQDN(v) || isURL(v),
  email: isEmail,
  verifyInfo: (v) => v === true,
}

const validateFormFields = (formData, formValidators) => {
  const fieldKeys = Object.keys(formData)
  return fieldKeys.every((key) => {
    const validator = formValidators[key]
    return validator ? validator(formData[key]) : true
  })
}

export default function TextingComplianceRegisterPage() {
  const [disableSubmit, setDisableSubmit] = useState(true)
  const handleFormOnChange = (formData) => {
    const shouldDisableSubmit = !validateFormFields(formData, formValidators)
    setDisableSubmit(shouldDisableSubmit)
  }
  return (
    <div className="min-h-screen bg-white pt-2 md:pt-0 md:min-h-0">
      <TextingComplianceHeader>
        <H5 className="flex-1 text-center md:hidden">Register</H5>
      </TextingComplianceHeader>

      <div className="mx-auto max-w-2xl px-4 py-6 md:px-8 md:py-8">
        <H2 className="mb-6 hidden md:block">Register your campaign</H2>

        <NewInfoAlert className="mb-6">
          <Body2>This information must match your election filings</Body2>
        </NewInfoAlert>

        <TextingComplianceRegistrationForm
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
