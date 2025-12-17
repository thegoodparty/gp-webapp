import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import Button from '@shared/buttons/Button'
import PasswordInput from '@shared/inputs/PasswordInput'

interface ResetPasswordFormProps {
  password: string
  confirmPassword: string
  isValid: boolean
  isMatch: boolean
  onPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export default function ResetPasswordForm({
  password,
  confirmPassword,
  isValid,
  isMatch,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: ResetPasswordFormProps): React.JSX.Element {
  const showConfirmError = confirmPassword !== '' && !isMatch

  return (
    <form noValidate onSubmit={onSubmit}>
      <hgroup className="text-center">
        <H1 className="mb-4">Reset Password</H1>
        <Body2 className="mb-8">
          You have requested to reset your password.
          <br /> Enter new password below.
        </Body2>
      </hgroup>
      <PasswordInput
        value={password}
        label="New Password"
        onChangeCallback={onPasswordChange}
        error={password !== '' && !isValid}
      />
      <PasswordInput
        className="mt-6"
        value={confirmPassword}
        label="Confirm New Password"
        onChangeCallback={onConfirmPasswordChange}
        error={showConfirmError}
        helperText={showConfirmError ? 'Passwords do not match' : undefined}
      />
      <Button
        className="w-full mt-8"
        type="submit"
        size="large"
        disabled={!isValid || !isMatch}
      >
        Update Password
      </Button>
    </form>
  )
}
