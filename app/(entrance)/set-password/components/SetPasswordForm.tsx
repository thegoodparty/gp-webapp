import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import Button from '@shared/buttons/Button'
import PasswordInput from '@shared/inputs/PasswordInput'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'

interface SetPasswordFormProps {
  password: string
  confirmPassword: string
  isValid: boolean
  isMatch: boolean
  onPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onSubmit: () => void
}

export default function SetPasswordForm({
  password,
  confirmPassword,
  isValid,
  isMatch,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: SetPasswordFormProps): React.JSX.Element {
  const showConfirmError = confirmPassword !== '' && !isMatch

  const handleTrackClick = () => {
    trackEvent(EVENTS.SetPassword.ClickSetPassword)
  }

  return (
    <form noValidate onSubmit={onSubmit}>
      <hgroup className="text-center">
        <H1 className="mb-4">Set your password</H1>
        <Body2 className="mb-8">
          Please set a password for your free account
        </Body2>
      </hgroup>
      <PasswordInput
        value={password}
        label="Password"
        onChangeCallback={onPasswordChange}
        error={password !== '' && !isValid}
      />
      <PasswordInput
        className="mt-6"
        value={confirmPassword}
        label="Confirm Password"
        onChangeCallback={onConfirmPasswordChange}
        error={showConfirmError}
        helperText={showConfirmError ? 'Passwords do not match' : undefined}
      />
      <Button
        className="!block mx-auto mt-8"
        type="submit"
        size="large"
        onClick={handleTrackClick}
        disabled={!isValid || !isMatch}
      >
        Set Password
      </Button>
    </form>
  )
}
