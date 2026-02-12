'use client'
import { useState, FormEvent } from 'react'
import { passwordRegex, updateUser } from 'helpers/userHelper'
import H4 from '@shared/typography/H4'
import Body2 from '@shared/typography/Body2'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import Paper from '@shared/utils/Paper'
import H2 from '@shared/typography/H2'
import PasswordInput from '@shared/inputs/PasswordInput'
import DeleteAccountButton from './DeleteAccountButton'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { User } from 'helpers/types'

const PASSWORD_REQUEST_FAILED = 'Password request failed'
const CURRENT_PASSWORD_INCORRECT = 'Old password is incorrect'
const INVALID_PASSWORD_MSG = 'Invalid password'

interface PasswordState {
  oldPassword: string
  password: string
}

interface PasswordSectionProps {
  user: User
}

const PasswordSection = ({
  user: initUser,
}: PasswordSectionProps): React.JSX.Element => {
  const [user, setUser] = useState<User>(initUser)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [, setPasswordChangeSuccessful] = useState(false)

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
    (user &&
      user.hasPassword &&
      state.password !== '' &&
      state.oldPassword !== '' &&
      // TODO: No check here for regex match because only length is checked in the API.
      //  https://github.com/thegoodparty/tgp-api/blob/develop/api/controllers/user/password/update.js#L7-L21
      //  We need to apply the same restrictions on passwords in the API as we do here in
      //  the UX.
      state.oldPassword.length > 7 &&
      state.password.match(passwordRegex) &&
      state.password.length > 7) ||
    (!user.hasPassword && state.password !== '' && state.password.length > 7)

  const reset = (): void => {
    setState(initialState)
  }

  const handleReqResult = async (result: {
    ok: boolean
    data: { message?: string }
    status: number
  }): Promise<void> => {
    if (result.ok) {
      setErrorMessage(null)
      setPasswordChangeSuccessful(true)
      const updatedUser = await updateUser()
      if (updatedUser) {
        setUser(updatedUser)
      }
      reset()
    } else {
      const reason = result.data
      setPasswordChangeSuccessful(false)
      setErrorMessage(
        result.status === 401 && reason.message === INVALID_PASSWORD_MSG
          ? CURRENT_PASSWORD_INCORRECT
          : PASSWORD_REQUEST_FAILED,
      )
    }
  }

  const doPasswordChange = async (): Promise<void> => {
    const { password, oldPassword } = state
    setLoading(true)
    try {
      const result = await clientFetch<{ message?: string }>(
        apiRoutes.user.changePassword,
        {
          id: user.id,
          newPassword: password,
          oldPassword,
        },
      )

      await handleReqResult({
        ok: result.ok,
        data: result.data ? { message: result.data.message } : {},
        status: result.status,
      })
    } catch (error) {
      console.error(error)
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
          {user?.hasPassword ? 'Change' : 'Create'} your password
          {errorMessage && (
            <Body2 className="text-error mt-3">{errorMessage}</Body2>
          )}
        </Body2>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 lg:col-span-6">
            {user?.hasPassword && (
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
