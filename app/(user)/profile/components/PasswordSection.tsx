'use client'
import { useState, FormEvent } from 'react'
import { useUser } from '@clerk/nextjs'
import { passwordRegex } from 'helpers/userHelper'
import { CLERK_ERRORS } from 'helpers/clerkErrors'
import H4 from '@shared/typography/H4'
import Body2 from '@shared/typography/Body2'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import Paper from '@shared/utils/Paper'
import H2 from '@shared/typography/H2'
import PasswordInput from '@shared/inputs/PasswordInput'
import DeleteAccountButton from './DeleteAccountButton'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { User } from 'helpers/types'

const CURRENT_PASSWORD_INCORRECT = 'Old password is incorrect'

interface PasswordState {
  oldPassword: string
  password: string
}

interface PasswordSectionProps {
  user: User
}

const PasswordSection = ({
  user,
}: PasswordSectionProps): React.JSX.Element => {
  const { user: clerkUser } = useUser()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [passwordChangeSuccessful, setPasswordChangeSuccessful] =
    useState(false)

  const hasPassword = user.hasPassword

  const initialState: PasswordState = {
    oldPassword: '',
    password: '',
  }
  const [state, setState] = useState<PasswordState>(initialState)

  const onChangeField = (key: keyof PasswordState, val: string): void => {
    setErrorMessage(null)
    setPasswordChangeSuccessful(false)
    setState({
      ...state,
      [key]: val,
    })
  }

  const fieldsValid =
    (hasPassword &&
      state.password !== '' &&
      state.oldPassword !== '' &&
      state.oldPassword.length > 7 &&
      state.password.match(passwordRegex) &&
      state.password.length > 7) ||
    (!hasPassword &&
      state.password !== '' &&
      state.password.match(passwordRegex) &&
      state.password.length > 7)

  const reset = (): void => {
    setState(initialState)
  }

  const doPasswordChange = async (): Promise<void> => {
    const { password, oldPassword } = state
    if (!clerkUser) {
      setErrorMessage('User session not found. Please refresh and try again.')
      return
    }
    setLoading(true)
    try {
      if (hasPassword) {
        await clerkUser.updatePassword({
          currentPassword: oldPassword,
          newPassword: password,
        })
      } else {
        await clerkUser.updatePassword({
          newPassword: password,
        })
      }
      setErrorMessage(null)
      setPasswordChangeSuccessful(true)
      reset()
    } catch (err: any) {
      setPasswordChangeSuccessful(false)
      const clerkError = err?.errors?.[0]
      if (clerkError?.code === CLERK_ERRORS.PASSWORD_INCORRECT) {
        setErrorMessage(CURRENT_PASSWORD_INCORRECT)
      } else if (
        clerkError?.code === CLERK_ERRORS.PASSWORD_VALIDATION_FAILED
      ) {
        setErrorMessage(
          clerkError?.longMessage ||
            'New password does not meet security requirements',
        )
      } else {
        setErrorMessage(
          clerkError?.longMessage || 'Failed to change password',
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSavePassword = (): void => {
    trackEvent(EVENTS.Settings.Password.ClickSave)
    if (fieldsValid) {
      doPasswordChange()
    }
  }

  return (
    <Paper className="mt-4">
      <H2>Password</H2>
      <Body2 className="text-gray-600 mb-8">
        Update your password and manage account.
      </Body2>
      <form noValidate onSubmit={(e: FormEvent) => e.preventDefault()}>
        <H4>Password</H4>
        <Body2 className="text-indigo-600 mb-6">
          {hasPassword ? 'Change' : 'Create'} your password
          {errorMessage && (
            <Body2 className="text-error mt-3">{errorMessage}</Body2>
          )}
          {passwordChangeSuccessful && (
            <Body2 className="text-green-600 mt-3">
              Password updated successfully
            </Body2>
          )}
        </Body2>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 lg:col-span-6">
            {hasPassword && (
              <div className="mb-4">
                <PasswordInput
                  value={state.oldPassword}
                  onChangeCallback={(pwd: string) => {
                    onChangeField('oldPassword', pwd)
                  }}
                  label="Old Password"
                  helperText=""
                  error={errorMessage === CURRENT_PASSWORD_INCORRECT}
                />
              </div>
            )}
          </div>
          <div className="col-span-12 lg:col-span-6 hidden lg:block">
            &nbsp;
          </div>
          <div className="col-span-12 lg:col-span-6">
            <PasswordInput
              value={state.password}
              onChangeCallback={(pwd: string) => {
                onChangeField('password', pwd)
              }}
              label="New Password"
              error={
                errorMessage !== null &&
                errorMessage !== CURRENT_PASSWORD_INCORRECT
              }
            />
          </div>

          <div className="col-span-12 lg:col-span-6 hidden lg:block">
            &nbsp;
          </div>

          <div className="col-span-12 ">&nbsp;</div>

          <div className="col-span-12 lg:col-span-6">
            <div>
              <PrimaryButton
                disabled={!fieldsValid}
                type="submit"
                loading={loading}
                onClick={handleSavePassword}
              >
                Save Changes
              </PrimaryButton>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="flex justify-end">
              <DeleteAccountButton userId={user.id} />
            </div>
          </div>
        </div>
      </form>
    </Paper>
  )
}

export default PasswordSection
