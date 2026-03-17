import { CheckRounded } from '@mui/icons-material'
import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import Button from '@shared/buttons/Button'

interface ForgotPasswordSuccessProps {
  email: string
}

export default function ForgotPasswordSuccess({
  email,
}: ForgotPasswordSuccessProps): React.JSX.Element {
  return (
    <>
      <hgroup className="text-center">
        <H1 className="mb-4">Request Submitted</H1>
        <Body2 className="mb-8">
          An email has been sent to&nbsp;
          <span className="font-semibold">{email}</span>. If this email is
          associated with a GoodParty.org account, you&apos;ll receive a link to
          reset your password shortly. Please check your inbox and spam folder.
        </Body2>
      </hgroup>
      <div className="rounded-full my-16 mx-auto h-[120px] w-[120px] flex items-center justify-center bg-green">
        <CheckRounded className="text-8xl text-white" />
      </div>
      <Button href="/" size="large" className="w-full">
        Return to GoodParty.org
      </Button>
    </>
  )
}
