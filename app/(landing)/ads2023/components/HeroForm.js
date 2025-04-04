'use client'

import { Checkbox } from '@mui/material'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { subscribeEmail } from '@shared/inputs/EmailForm'
import { isValidEmail } from '@shared/inputs/EmailInput'
import { isValidPhone } from '@shared/inputs/PhoneInput'
import Body1 from '@shared/typography/Body1'
import H3 from '@shared/typography/H3'
import RenderInputField from '@shared/inputs/RenderInputField'
import { getUserCookie } from 'helpers/cookieHelper'
import { useEffect, useState } from 'react'

const fields = [
  {
    key: 'firstName',
    label: 'First Name',
    required: true,
    type: 'text',
  },
  {
    key: 'lastName',
    label: 'Last Name',
    required: true,
    type: 'text',
  },
  {
    key: 'phone',
    label: 'Phone',
    required: true,
    type: 'phone',
  },
  {
    key: 'email',
    label: 'Email',
    required: true,
    type: 'email',
  },
]
export default function HeroForm() {
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    forOffice: false,
  })

  useEffect(() => {
    const user = getUserCookie(true)
    if (user) {
      setState({
        ...state,
        email: user.email || '',
        phone: user.phone || '',
      })
    }
  }, [])

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    })
  }

  const canSubmit = () => {
    return (
      state.firstName !== '' &&
      state.lastName !== '' &&
      isValidEmail(state.email) &&
      isValidPhone(state.phone)
    )
  }

  const handleSubmit = async () => {
    if (!canSubmit()) {
      return
    }
    const payload = {
      ...state,
      uri: window.location.href,
      pageName: 'ads2023',
      formId: 'c7d78873-1ed0-4202-ab01-76577e57352c',
    }

    delete payload.forOffice
    if (state.forOffice) {
      payload.additionalFields = JSON.stringify([
        {
          name: 'candidate_interest',
          value: 'yes',
          objectTypeId: '0-1',
        },
      ])
    }
    const res = await subscribeEmail(payload)
    if (res) {
      setSubmitSuccess('success')
    } else {
      setSubmitSuccess('error')
    }
  }
  return (
    <div className="pt-5 pb-9 px-7 bg-secondary-light rounded-3xl relative z-20">
      <h2 className="font-outfit text-5xl font-medium mb-10">
        Join our community
      </h2>
      {submitSuccess === 'success' ? (
        <H3>Thank you! we will be in touch soon.</H3>
      ) : (
        <form
          noValidate
          onSubmit={(e) => e.preventDefault()}
          id="ads23-hero-form"
        >
          <div className="grid grid-cols-12 gap-4">
            {fields.map((field) => (
              <div key={field.key} className="col-span-12 md:col-span-6">
                <RenderInputField
                  field={field}
                  value={state[field.key]}
                  onChangeCallback={onChangeField}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center">
            <Checkbox
              value={state.forOffice}
              onChange={(e) => {
                onChangeField('forOffice', e.target.checked)
              }}
            />
            <span>I&apos;m interested in running for office</span>
          </div>
          <div
            className="mt-8"
            onClick={handleSubmit}
            id="ads23-hero-form-submit"
          >
            <PrimaryButton fullWidth disabled={!canSubmit()} type="submit">
              Start taking action
            </PrimaryButton>
          </div>
          {submitSuccess === 'error' && (
            <Body1 className="text-red mt-1">
              Error submitting your form. Please refresh and try again.
            </Body1>
          )}
        </form>
      )}
    </div>
  )
}
