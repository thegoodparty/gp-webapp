import H1 from '@shared/typography/H1';
import Body2 from '@shared/typography/Body2';
import Button from '@shared/buttons/Button';
import TextField from '@shared/inputs/TextField';

export default function ResetPasswordForm({
  password,
  confirmPassword,
  isValid,
  isMatch,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}) {
  return (
    <form noValidate onSubmit={onSubmit}>
      <hgroup className="text-center">
        <H1 className="mb-4">Reset Password</H1>
        <Body2 className="mb-8">
          You have requested to reset your password.
          <br /> Enter new password below.
        </Body2>
      </hgroup>
      <TextField
        newStyle
        concealValue
        type="password"
        value={password}
        label="New Password"
        fullWidth
        onChange={(e) => onPasswordChange(e.target.value)}
        error={password !== '' && !isValid}
        helperText={
          'Please ensure your password has at least 8 characters, including at least one letter and one number.'
        }
      />
      <TextField
        className="mt-6"
        newStyle
        concealValue
        type="password"
        value={confirmPassword}
        label="Confirm New Password"
        fullWidth
        onChange={(e) => onConfirmPasswordChange(e.target.value)}
        error={confirmPassword !== '' && !isMatch}
        helperText={
          confirmPassword !== '' && !isMatch && 'Passwords do not match'
        }
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
  );
}
