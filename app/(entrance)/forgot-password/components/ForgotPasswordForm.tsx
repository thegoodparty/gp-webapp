import Link from 'next/link'
import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import Button from '@shared/buttons/Button'
import Overline from '@shared/typography/Overline'
import EmailInput from '@shared/inputs/EmailInput'

interface ForgotPasswordFormProps {
  email: string
  isValid: boolean
  onEmailChange: (email: string, isValid: boolean) => void
  onSubmit: (e: React.FormEvent) => void
}

export default function ForgotPasswordForm({
  email,
  isValid,
  onEmailChange,
  onSubmit,
}: ForgotPasswordFormProps): React.JSX.Element {
  const showError = email !== '' && !isValid

  return (
    <form noValidate onSubmit={onSubmit}>
      <hgroup className="text-center">
        <H1 className="mb-4">Forgot Password?</H1>
        <Body2 className="mb-8">
          Enter your email and we&apos;ll send you a link to reset your
          password.
        </Body2>
      </hgroup>

      <EmailInput
        required
        value={email}
        placeholder="hello@email.com"
        newCallbackSignature
        onChangeCallback={onEmailChange}
        helperText={
          showError ? 'Please enter a valid email address' : undefined
        }
        endAdornments={showError ? ['error'] : undefined}
        variant="outlined"
      />
      <Body2 className="mt-6 mb-8 text-center text-gray-600">
        Having trouble? &nbsp;
        <Link href="/contact" className="text-blue">
          Send us a message.
        </Link>
      </Body2>
      <Button className="w-full" type="submit" size="large" disabled={!isValid}>
        Send Link
      </Button>
      <Overline className="relative font-medium text-center py-2 my-2 before:block before:bg-black/[0.12] before:absolute before:h-px before:w-full before:top-1/2">
        <span className="relative z-10 bg-white px-6">OR</span>
      </Overline>

      <Button
        href="/login"
        type="button"
        size="large"
        variant="outlined"
        className="w-full"
      >
        Back to Login
      </Button>
    </form>
  )
}
