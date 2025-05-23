'use client'

import { isValidEmail } from '@shared/inputs/EmailInput'
import { useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import PrimaryButton from '@shared/buttons/PrimaryButton'
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

export default function EmailForm({
  formId,
  pageName,
  label = 'Get Started',
  labelId,
  submitButtonId,
}) {
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [showError, setShowError] = useState(false)

  const canSubmit = () => isValidEmail(email)

  const submitForm = async () => {
    if (canSubmit()) {
      const success = await subscribeEmail({
        email,
        uri: window.location.href,
        formId,
        pageName,
      })

      if (window.dataLayer) {
        window.dataLayer.push({
          event: labelId,
          'hs-form-guid': formId,
          'hs-form-name': labelId,
        })
      }

      if (success) {
        setSuccess(true)
        setShowError(false)
      } else {
        setShowError('An error occurred. Please try again.')
      }
    } else {
      setShowError('Please enter a valid email')
    }
  }
  return (
    <form
      className="pt-5"
      noValidate
      onSubmit={(e) => e.preventDefault()}
      id={labelId}
    >
      {success ? (
        <div
          className={`bg-purple text-white rounded-full mb-24 lg:mb-0 lg:w-[50%] xl:w-[45%] py-5 px-7 flex justify-between items-center`}
        >
          <div>Check your email to learn more</div>
          <div>
            <FaCheck />
          </div>
        </div>
      ) : (
        <>
          <div
            className={`flex flex-col md:flex-row relative lg:mb-0 flex-auto max-w-lg`}
          >
            <input
              type="email"
              name="email"
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              value={email}
              placeholder="Email"
              className="py-4 pl-4 border-slate-300 border-2 rounded-lg w-full text-black placeholder-black"
            />

            <div
              className="flex flex-col flex-auto whitespace-nowrap md:pl-3 pt-2 pb-2 md:pb-0 md:pt-0"
              type="submit"
            >
              <PrimaryButton
                id={submitButtonId || 'submit-email'}
                onClick={submitForm}
              >
                {label}
              </PrimaryButton>
            </div>

            {!!showError && (
              <div className="text-sm text-red-600 pl-5 pt-1 font-bold drop-shadow">
                {showError}
              </div>
            )}
          </div>
        </>
      )}
    </form>
  )
}
