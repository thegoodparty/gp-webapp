'use client'
import { useState } from 'react'
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

export const TextingComplianceSubmitPinForm = ({
  onChange = () => {},
  initialFormData = initialFormState,
}) => {
  const [formData, setFormData] = useState({
    ...initialFormState,
    ...initialFormData,
  })
  const { pin } = formData

  const handleChange = (change) => {
    const newFormData = {
      ...formData,
      ...change,
    }
    setFormData(newFormData)
    onChange(newFormData)
  }

  return (
    <form className="space-y-4 pb-16 md:p-0">
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
    </form>
  )
}
