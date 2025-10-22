'use client'
import { isValidEmail } from '@shared/inputs/EmailInput.js'
import { isValidPhone } from '@shared/inputs/PhoneInput.js'
import PasswordInput from '@shared/inputs/PasswordInput.js'
import MaxWidth from '@shared/layouts/MaxWidth'
import { Fragment, useState } from 'react'
import H1 from '@shared/typography/H1'
import { isValidPassword } from '@shared/inputs/IsValidPassword'
import Paper from '@shared/utils/Paper'
import Body2 from '@shared/typography/Body2'
import RenderInputField from '@shared/inputs/RenderInputField'
import Link from 'next/link'
import { useUser } from '@shared/hooks/useUser'
import saveToken from 'helpers/saveToken'
import { useSnackbar } from 'helpers/useSnackbar'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { doPostAuthRedirect } from 'app/(candidate)/onboarding/shared/ajaxActions'
import Button from '@shared/buttons/Button'
import { useRouter } from 'next/navigation'
import {
  EVENTS,
  trackEvent,
  trackRegistrationCompleted,
} from 'helpers/analyticsHelper'
import { analytics } from '@shared/utils/analytics'

const SIGN_UP_MODES = {
  CANDIDATE: 'candidate',
}

const SIGN_UP_FIELDS = [
  {
    key: 'firstName',
    label: 'First Name',
    type: 'text',
    placeholder: 'Jane',
    required: true,
  },
  {
    key: 'lastName',
    label: 'Last Name',
    type: 'text',
    placeholder: 'Doe',
    required: true,
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'hello@email.com',
    required: true,
  },
  {
    key: 'phone',
    label: 'Phone Number',
    type: 'phone',
    placeholder: '(123) 456-6789',
    cols: 6,
    noBottomMargin: true,
    required: true,
  },
  {
    key: 'zip',
    label: 'Zip Code',
    type: 'text',
    placeholder: '12345',
    cols: 6,
    noBottomMargin: true,
    required: true,
  },
]

export const validateZip = (zip) => {
  const validZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/
  return validZip.test(zip)
}

async function register({
  firstName,
  lastName,
  email,
  phone,
  zip,
  password,
  signUpMode,
}) {
  try {
    const resp = await clientFetch(apiRoutes.authentication.register, {
      firstName,
      lastName,
      email,
      phone,
      zip,
      password,
      signUpMode,
    })

    if (resp.status === 409) {
      return { exists: true }
    }
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export default function SignUpPage() {
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    signUpMode: SIGN_UP_MODES.CANDIDATE,
    email: '',
    phone: '',
    zip: '',
    password: '',
  })

  const [fields] = useState([...SIGN_UP_FIELDS])
  const [loading, setLoading] = useState(false)
  const { errorSnackbar } = useSnackbar()
  const [_, setUser] = useUser()
  const router = useRouter()

  const { firstName, lastName, signUpMode, email, phone, zip, password } = state

  const enableSubmit =
    firstName &&
    lastName &&
    isValidEmail(email) &&
    isValidPassword(password) &&
    isValidPhone(phone) &&
    validateZip(zip)

  const handleSubmit = async () => {
    if (loading) return
    setLoading(true)

    if (enableSubmit) {
      const result = await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email,
        phone: phone === '' ? undefined : phone,
        zip,
        password,
        signUpMode,
      })

      if (!result || !result.user) {
        errorSnackbar('Failed to create account')
        setLoading(false)
        return
      }

      const { user, token, campaign } = result

      await saveToken(token)
      setUser(user)

      await trackRegistrationCompleted({
        analytics,
        userId: user.id,
        email: user.email || email,
      })

      try {
        const redirect = await doPostAuthRedirect(campaign)
        setLoading(false)
        if (redirect) {
          router.push(redirect)
        } else {
          errorSnackbar('Failed to set up account. Please try logging in.')
        }
      } catch (error) {
        console.error('Post-auth redirect error:', error)
        setLoading(false)
        errorSnackbar(
          'Account created but failed to redirect. Please try logging in.',
        )
      }
    }
  }

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    })
  }

  return (
    <div className="bg-indigo-100">
      <MaxWidth>
        <div className="flex items-center justify-center">
          <div className="grid py-6 max-w-2xl w-[75vw]">
            <Paper className="p-5 md:p-8 lg:p-12">
              <div className="text-center mb-8 pt-8">
                <H1>Join GoodParty.org</H1>
                <Body2 className="mt-3">
                  Join the movement of candidates who refuse to accept the
                  status quo and are committed to breaking free from the
                  two-party system.{' '}
                </Body2>
                <Body2 className="mt-3">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    onClick={() => trackEvent(EVENTS.SignUp.ClickLogin)}
                    className="underline text-info-main"
                  >
                    Login here.
                  </Link>
                </Body2>
              </div>

              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault()
                }}
                id="register-page-form"
              >
                <div className="grid grid-cols-12 gap-4">
                  {fields.map((field) => (
                    <Fragment key={field.key}>
                      <RenderInputField
                        field={field}
                        onChangeCallback={onChangeField}
                        value={state[field.key]}
                      />
                    </Fragment>
                  ))}
                  <div className="col-span-12 mt-2">
                    <PasswordInput
                      label="Password"
                      value={state.password}
                      onChangeCallback={(pwd) => onChangeField('password', pwd)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      placeholder="Please don't use your dog's name"
                    />
                  </div>
                </div>

                <div className="mt-8" onClick={handleSubmit}>
                  <Button
                    disabled={loading || !enableSubmit}
                    type="submit"
                    color="primary"
                    size="large"
                    className="w-full"
                    loading={loading}
                  >
                    Join
                  </Button>
                </div>
              </form>
            </Paper>
          </div>
        </div>
      </MaxWidth>
    </div>
  )
}
