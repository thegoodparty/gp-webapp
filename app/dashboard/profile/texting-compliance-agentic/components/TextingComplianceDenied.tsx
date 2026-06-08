import { Card } from '@styleguide'
import { CircleAlertIcon } from '@styleguide/components/ui/icons'

const SUPPORT_EMAIL = 'campaignsuccess@goodparty.org'

export default function TextingComplianceDenied(): React.JSX.Element {
  return (
    <Card className="p-4 md:p-6 mt-4 gap-2" id="texting-compliance">
      <h2 className="text-2xl font-semibold mb-4">Texting Compliance</h2>
      <div className="flex items-start gap-2">
        <CircleAlertIcon
          className="h-6 w-6 shrink-0 text-red-600"
          aria-hidden
        />
        <div>
          <p className="text-lg font-medium">
            Your profile needs updates before sending texts
          </p>
          <p className="text-sm text-secondary">
            Email{' '}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-blue-600 underline"
            >
              {SUPPORT_EMAIL}
            </a>{' '}
            and we’ll help you fix the issues.
          </p>
        </div>
      </div>
    </Card>
  )
}
