import MaxWidth from '@shared/layouts/MaxWidth'
import FormSection from './FormSection'

interface SetPasswordPageProps {
  email: string
  token: string
}

export default function SetPasswordPage({
  email,
  token,
}: SetPasswordPageProps): React.JSX.Element {
  return (
    <div className="bg-indigo-100 min-h-[calc(100vh-60px)]">
      <MaxWidth>
        <FormSection email={email} token={token} />
      </MaxWidth>
    </div>
  )
}
