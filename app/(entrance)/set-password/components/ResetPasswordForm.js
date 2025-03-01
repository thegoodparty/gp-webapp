import H1 from '@shared/typography/H1';
import Body2 from '@shared/typography/Body2';
import Button from '@shared/buttons/Button';
import PasswordInput from '@shared/inputs/PasswrodInput';
import { trackEvent, EVENTS } from 'helpers/fullStoryHelper';

export default function ResetPasswordForm({
  password,
  confirmPassword,
  isValid,
  isMatch,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  createMode,
}) {
  const showConfirmError = confirmPassword !== '' && !isMatch;

  const handleTrackClick = () => {
    if (createMode) {
      trackEvent(EVENTS.SetPassword.ClickGetStarted);
    }
  };

  return (
    <form noValidate onSubmit={onSubmit}>
      <hgroup className="text-center">
        <H1 className="mb-4">Supercharge your campaign</H1>
        {createMode ? (
          <Body2 className="mb-8">
            Please set a password for your new account
          </Body2>
        ) : (
          <Body2 className="mb-8">
            You have requested to reset your password.
            <br /> Enter new password below.
          </Body2>
        )}
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
        helperText={showConfirmError && 'Passwords do not match'}
      />
      <Button
        className="w-full mt-8"
        type="submit"
        size="large"
        onClick={handleTrackClick}
        disabled={!isValid || !isMatch}
      >
        {createMode ? 'Get started' : 'Update password'}
      </Button>
    </form>
  );
}
