'use client'
import { useState } from 'react'
import ResetPasswordForm from './ResetPasswordForm'
import CardPageWrapper from '@shared/cards/CardPageWrapper'
import ResetPasswordSuccess from './ResetPasswordSuccess'
import { useSnackbar } from 'helpers/useSnackbar'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'

async function resetPassword(email, password, token) {
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

export default function ResetPasswordPage({ email, token }) {
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

  function handlePasswordChange(newPwd, pwdValid) {
    setPassword({
      value: newPwd,
      isValid: pwdValid,
    })

    setConfirmPassword((state) => ({
      ...state,
      isMatch: state.value === newPwd,
    }))
  }

  function handleConfirmChange(newConfirmPwd) {
    setConfirmPassword({
      value: newConfirmPwd,
      isMatch: password === newConfirmPwd,
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (isValid) {
      const res = await resetPassword(email, password, token)

      if (res.ok) {
        setResetSuccessful(true)
        successSnackbar(`Your password has been updated`)
      } else {
        errorSnackbar(`Error updating password: ${res.data?.message}`)
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
