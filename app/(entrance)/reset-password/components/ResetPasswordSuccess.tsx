import Button from '@shared/buttons/Button'
import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import { CheckRounded } from '@mui/icons-material'

export default function ResetPasswordSuccess(): React.JSX.Element {
  return (
    <>
      <hgroup className="text-center">
        <H1 className="mb-4">Success!</H1>
        <Body2 className="mb-8">Your password has been updated.</Body2>
      </hgroup>
      <div className="rounded-full mx-auto my-16 h-[120px] w-[120px] flex items-center justify-center bg-green">
        <CheckRounded className="text-8xl text-white" />
      </div>
      <Button href="/login" size="large" className="w-full">
        Login
      </Button>
      <Button href="/" variant="outlined" size="large" className="mt-4 w-full">
        Return to GoodParty.org
      </Button>
    </>
  )
}
