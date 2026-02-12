'use client'
import EmailInput, { isValidEmail } from '@shared/inputs/EmailInput'
import PasswordInput from '@shared/inputs/PasswordInput'
import { setUserCookie } from 'helpers/cookieHelper'
import Link from 'next/link.js'
import { Suspense, useState } from 'react'
import H1 from '@shared/typography/H1'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { isValidPassword } from '@shared/inputs/IsValidPassword'
import { useUser } from '@shared/hooks/useUser'
import CardPageWrapper from '@shared/cards/CardPageWrapper'
import Body2 from '@shared/typography/Body2'
import SocialLoginButtons from './SocialLoginButtons'
import saveToken from 'helpers/saveToken'
import { useSnackbar } from 'helpers/useSnackbar'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { identifyUser } from '@shared/utils/analytics'
import { useRouter } from 'next/navigation'

import { doLoginRedirect } from '@shared/utils/doLoginRedirect'
import { User, Campaign } from 'helpers/types'

interface LoginState {
  email: string
  password: string
}

interface LoginResponse {
  user: User
  campaign?: Campaign
  token: string
}

export const validateZip = (zip: string): boolean => {
  const validZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/
  return validZip.test(zip)
}

async function login(
  email: string,
  password: string,
): Promise<LoginResponse | false> {
  try {
    const payload = {
      email,
      password,
    }
    const resp = await clientFetch<LoginResponse>(
      apiRoutes.authentication.login,
      payload,
    )
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export default function LoginPage(): React.JSX.Element {
  const [state, setState] = useState<LoginState>({
    email: '',
    password: '',
  })

  const [_, setUser] = useUser()
  const { errorSnackbar } = useSnackbar()
  const router = useRouter()

  const enableSubmit = (): boolean =>
    isValidEmail(state.email) && isValidPassword(state.password)

  const handleSubmit = async (): Promise<void> => {
    if (enableSubmit()) {
      const result = await login(state.email, state.password)

      if (result && result.user) {
        const { user, campaign, token } = result
        await saveToken(token)
        setUserCookie(user)
        setUser(user)
        const { id, email: userEmail, firstName, lastName, phone, zip } = user
        await identifyUser(id, {
          email: userEmail,
          firstName: firstName ?? undefined,
          lastName: lastName ?? undefined,
          phone: phone ?? undefined,
          zip: zip ?? undefined,
        })

        await doLoginRedirect(router, user, campaign)
      } else {
        errorSnackbar(
          'Invalid login. Please check your credentials and try again.',
        )
      }
    }
  }

  const onChangeField = (value: string, key: keyof LoginState): void => {
    setState({
      ...state,
      [key]: value,
    })
  }

  return (
    <CardPageWrapper>
      <div className={`flex items-center justify-center `}>
        <div className="grid max-w-lg w-[75vw]">
          <div className="text-center mb-4">
            <H1>Login to GoodParty.org</H1>
            <Body2 className="mt-3">
              Don&apos;t have an account?{' '}
              <Link
                href="/sign-up"
                onClick={() => trackEvent(EVENTS.SignIn.ClickCreateAccount)}
                className="underline text-info"
              >
                Create an account
              </Link>
            </Body2>
          </div>

          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
            }}
            data-cy="email-form"
            id="register-page-form"
          >
            <div className="flex mt-5">
              <EmailInput
                onChangeCallback={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onChangeField(e.target.value, 'email')
                }
                value={state.email}
                shrink
                placeholder="hello@email.com"
                data-testid="login-email-input"
                variant="outlined"
              />
            </div>

            <div className="flex mt-5">
              <PasswordInput
                value={state.password}
                label="Password"
                onChangeCallback={(pwd) => onChangeField(pwd, 'password')}
                placeholder="Please don't use your dog's name"
                data-testid="login-password-input"
              />
            </div>
            <div className="flex justify-center mt-12" onClick={handleSubmit}>
              <PrimaryButton
                disabled={!enableSubmit()}
                type="submit"
                fullWidth
                data-testid="login-submit-button"
              >
                Login
              </PrimaryButton>
            </div>
          </form>
          <div className="mt-5 text-center">
            <Link
              href="/forgot-password"
              onClick={() => trackEvent(EVENTS.SignIn.ClickForgotPassword)}
              className="text-sm underline"
              data-testid="login-forgot-password-link"
            >
              Forgot your password?
            </Link>
          </div>

          <Suspense>
            <SocialLoginButtons />
          </Suspense>
        </div>
      </div>
    </CardPageWrapper>
  )
}
