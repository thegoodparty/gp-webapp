'use client'
import { isValidEmail } from '@shared/inputs/EmailInput'
import { useState } from 'react'
import PhoneInput from '@shared/inputs/PhoneInput'
import TextField from '@shared/inputs/TextField'
import EmailInput from '@shared/inputs/EmailInput'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { Fragment } from 'react'
import { useSnackbar } from 'helpers/useSnackbar'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'

export async function subscribeEmail(payload) {
  try {
    await clientFetch(apiRoutes.homepage.subscribeEmail, payload)
    return true
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export default function SignupForm({
  formId,
  pageName,
  label = 'Get Started',
  labelId,
  horizontal = true,
  phoneField = true,
  onSuccessCallback = () => {},
}) {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [showError, setShowError] = useState(false)
  const [phone, setPhone] = useState('')
  const [showForm, setShowForm] = useState(true)
  const canSubmit = () => isValidEmail(email)
  const { successSnackbar, errorSnackbar } = useSnackbar()

  const fields = [
    {
      label: 'First Name',
      key: 'firstName',
      field: (
        <TextField
          name="firstName"
          onChange={(e) => {
            setFirstName(e.target.value)
          }}
          fullWidth
          value={firstName}
          placeholder="Jane"
          className="rounded-lg w-full bg-indigo-50 border border-indigo-200 text-black"
        />
      ),
      required: true,
    },
    {
      label: 'Last Name',
      key: 'lastName',
      field: (
        <TextField
          name="lastName"
          size="medium"
          fullWidth
          onChange={(e) => {
            setLastName(e.target.value)
          }}
          value={lastName}
          placeholder="Doe"
          className="rounded-lg w-full bg-indigo-50 border border-indigo-200 text-black"
        />
      ),
      required: true,
    },
    {
      label: 'Email',
      key: 'email',
      field: (
        <EmailInput
          name="email"
          onChangeCallback={(e) => {
            setEmail(e.target.value)
          }}
          value={email}
          placeholder="jane.doe@email.com"
          useLabel={false}
          className="rounded-lg w-full bg-indigo-50 border border-indigo-200 text-black"
        />
      ),
      required: true,
    },
  ]

  if (phoneField) {
    fields.push({
      label: 'Phone Number (optional)',
      key: 'phone',
      field: (
        <PhoneInput
          onChangeCallback={(phone, isValid) => {
            setPhone(phone)
          }}
          useLabel={false}
          placeholder="(123) 456-7890"
          className="rounded-lg w-full bg-indigo-50 border border-indigo-200 text-black"
          hideIcon
          shrink
        />
      ),
      required: false,
    })
  }

  const submitForm = async () => {
    if (canSubmit()) {
      const success = await subscribeEmail({
        email,
        firstName,
        lastName,
        phone,
        uri: window.location.href,
        formId,
        pageName,
      })
      if (success) {
        successSnackbar('Check your email to learn more', {
          autoHideDuration: null,
        })
        onSuccessCallback()
        setShowForm(false)
      } else {
        errorSnackbar('An error occurred. Please try again.')
      }
    } else {
      setShowError('Please enter a valid email')
    }
  }
  return (
    showForm && (
      <form
        noValidate
        onSubmit={(e) => e.preventDefault()}
        id={labelId}
        className="w-full"
      >
        <>
          <div
            className={`grid grid-cols-12 ${
              horizontal ? 'md:grid-cols-10' : ''
            }  w-full mb-1 mt-1`}
          >
            {fields.map((field) => {
              return (
                <Fragment key={field.key}>
                  <div
                    className={`col-span-12 ${
                      horizontal ? 'lg:col-span-2' : 'lg:col-span-12'
                    } w-full`}
                  >
                    <div className="mt-5 lg:ml-5 max-w-sm">
                      <span className="text-sm">{field.label}</span>
                      {field.required && (
                        <span className="text-sm text-red-600 ml-1">*</span>
                      )}
                      {field.field}
                    </div>
                  </div>
                </Fragment>
              )
            })}

            <div className="col-span-12 w-full">
              <div
                onClick={submitForm}
                className="mt-10 lg:ml-5 whitespace-nowrap"
              >
                <PrimaryButton
                  id="submit-email"
                  type="submit"
                  className="bg-black w-full text-white font-bold cursor-pointer"
                >
                  {label}
                </PrimaryButton>
              </div>
            </div>

            {!!showError && (
              <div className="text-sm text-red-600 pl-5 pt-1 font-bold drop-shadow">
                {showError}
              </div>
            )}
          </div>
        </>
      </form>
    )
  )
}
