'use client'
import { useState, FormEvent } from 'react'
import SetPasswordForm from './SetPasswordForm'
import SetPasswordSuccess from './SetPasswordSuccess'
import saveToken from 'helpers/saveToken'
import { setUserCookie } from 'helpers/cookieHelper'
import { useUser } from '@shared/hooks/useUser'
import { useSnackbar } from 'helpers/useSnackbar'
import Paper from '@shared/utils/Paper'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { User } from 'helpers/types'

interface PasswordState {
  value: string
  isValid: boolean
}

interface ConfirmPasswordState {
  value: string
  isMatch: boolean
}

interface SetPasswordResponse {
  user?: User
  token?: string
  ok?: boolean
  json?: () => Promise<{ message: string }>
}

interface FormSectionProps {
  email: string
  token: string
}

async function setPasswordApi(
  email: string,
  password: string,
  token: string,
): Promise<SetPasswordResponse | false> {
  try {
    const payload = {
      email,
      password,
      token,
      adminCreate: true,
    }
    const resp = await clientFetch<SetPasswordResponse>(
      apiRoutes.authentication.resetPassword,
      payload,
    )
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export default function FormSection({
  email,
  token,
}: FormSectionProps): React.JSX.Element {
  const [_, setUser] = useUser()
  const [{ value: password, isValid }, setPassword] = useState<PasswordState>({
    value: '',
    isValid: true,
  })
  const [{ value: confirmPassword, isMatch }, setConfirmPassword] =
    useState<ConfirmPasswordState>({
      value: '',
      isMatch: true,
    })
  const [resetSuccessful, setResetSuccesful] = useState(false)
  const { errorSnackbar, successSnackbar } = useSnackbar()

  function handlePasswordChange(newPwd: string, pwdValid: boolean): void {
    setPassword({
      value: newPwd,
      isValid: pwdValid,
    })

    setConfirmPassword((state) => ({
      ...state,
      isMatch: state.value === newPwd,
    }))
  }

  function handleConfirmChange(newConfirmPwd: string): void {
    setConfirmPassword({
      value: newConfirmPwd,
      isMatch: password === newConfirmPwd,
    })
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()

    if (isValid) {
      const res = await setPasswordApi(email, password, token)
      if (!res) {
        errorSnackbar('Error saving password')
        return
      }
      const { user, token: userToken } = res

      if (user && userToken) {
        await saveToken(userToken)
        setUserCookie(user)
        setUser(user)

        trackEvent(EVENTS.Password.PasswordSetCompleted)

        window.location.href = '/dashboard'
      } else if (res.ok === false && res.json) {
        const { message } = await res.json()
        errorSnackbar('Error saving password: ' + message)
      } else {
        successSnackbar('Password updated successfully.')
        setResetSuccesful(true)
      }
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="grid py-6 max-w-2xl w-[85vw]">
        <Paper>
          <div className="p-4 md:p-6 lg:p-8">
            {resetSuccessful ? (
              <SetPasswordSuccess />
            ) : (
              <SetPasswordForm
                password={password}
                confirmPassword={confirmPassword}
                isValid={isValid}
                isMatch={isMatch}
                onSubmit={handleSubmit}
                onPasswordChange={handlePasswordChange}
                onConfirmPasswordChange={handleConfirmChange}
              />
            )}
          </div>
        </Paper>
      </div>
    </div>
  )
}
