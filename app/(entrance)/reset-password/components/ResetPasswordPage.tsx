'use client'
import { useState } from 'react'
import ResetPasswordForm from './ResetPasswordForm'
import CardPageWrapper from '@shared/cards/CardPageWrapper'
import ResetPasswordSuccess from './ResetPasswordSuccess'
import { useSnackbar } from 'helpers/useSnackbar'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch, ApiResponse } from 'gpApi/clientFetch'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

async function resetPassword(
  email: string,
  password: string,
  token: string,
): Promise<ApiResponse | false> {
  try {
    const payload = {
      email,
      password,
      token,
    }
    return await clientFetch(apiRoutes.authentication.resetPassword, payload)
  } catch (e) {
    console.error('error', e)
    return false
  }
}

interface ResetPasswordPageProps {
  email: string
  token: string
}

export default function ResetPasswordPage({
  email,
  token,
}: ResetPasswordPageProps): React.JSX.Element {
  const [{ value: password, isValid }, setPassword] = useState({
    value: '',
    isValid: true,
  })
  const [{ value: confirmPassword, isMatch }, setConfirmPassword] = useState({
    value: '',
    isMatch: true,
  })
  const [resetSuccessful, setResetSuccessful] = useState(false)
  const { successSnackbar, errorSnackbar } = useSnackbar()

  function handlePasswordChange(newPwd: string, pwdValid: boolean) {
    setPassword({
      value: newPwd,
      isValid: pwdValid,
    })

    setConfirmPassword((state) => ({
      ...state,
      isMatch: state.value === newPwd,
    }))
  }

  function handleConfirmChange(newConfirmPwd: string) {
    setConfirmPassword({
      value: newConfirmPwd,
      isMatch: password === newConfirmPwd,
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (isValid) {
      const res = await resetPassword(email, password, token)

      if (res && res.ok) {
        setResetSuccessful(true)

        // Forgot password flow
        trackEvent(EVENTS.Password.PasswordResetCompleted)

        successSnackbar(`Your password has been updated`)
      } else {
        const data = res ? res.data : null
        const message =
          data && typeof data === 'object' && 'message' in data
            ? data.message
            : 'Unknown error'
        errorSnackbar(`Error updating password: ${message}`)
      }
    }
  }

  return (
    <CardPageWrapper>
      {resetSuccessful ? (
        <ResetPasswordSuccess />
      ) : (
        <ResetPasswordForm
          password={password}
          confirmPassword={confirmPassword}
          isValid={isValid}
          isMatch={isMatch}
          onSubmit={handleSubmit}
          onPasswordChange={handlePasswordChange}
          onConfirmPasswordChange={handleConfirmChange}
        />
      )}
    </CardPageWrapper>
  )
}
