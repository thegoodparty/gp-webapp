import Label from './Label'
import IssuesForm from './IssuesForm'
import H2 from '@shared/typography/H2'
import dynamic from 'next/dynamic'
import { WebsiteIssue } from 'helpers/types'
import { FilledErrorAlert } from '@shared/alerts/FilledErrorAlert'

const RichEditor = dynamic(() => import('app/shared/utils/RichEditor'), {
  ssr: false,
  loading: () => (
    <p className="p-4 text-center text-2xl font-bold">Loading Editor...</p>
  ),
})

export interface AboutStepErrors {
  bio?: string
  issues?: string
}

interface AboutStepProps {
  initialBio?: string
  initialIssues?: WebsiteIssue[]
  issues?: WebsiteIssue[]
  onBioChange: (content: string) => void
  onIssuesChange: (issues: WebsiteIssue[]) => void
  noHeading?: boolean
  errors?: AboutStepErrors
  bioCharCount?: number
  onBioCharCountChange?: (length: number) => void
}

export default function AboutStep({
  initialBio,
  initialIssues,
  issues,
  onBioChange,
  onIssuesChange,
  noHeading = false,
  errors,
  bioCharCount = 0,
  onBioCharCountChange,
}: AboutStepProps): React.JSX.Element {
  const alertMessage =
    errors?.bio && errors?.issues
      ? 'Please complete Your Bio and add a Key Issue'
      : errors?.bio
      ? 'Please complete Your Bio'
      : errors?.issues
      ? errors.issues
      : null

  return (
    <div>
      {!noHeading && <H2 className="mb-6">What is your campaign about?</H2>}
      {alertMessage && (
        <FilledErrorAlert className="mb-4">{alertMessage}</FilledErrorAlert>
      )}
      <Label>Your Bio <sup>*</sup></Label>
      <RichEditor
        initialText={initialBio}
        onChangeCallback={(content) => {
          onBioChange(content)
        }}
        onTextLengthChange={onBioCharCountChange}
      />
      <div
        className={`flex justify-between mt-1 text-xs font-medium ${
          errors?.bio ? 'text-error-main' : 'text-gray-500'
        }`}
      >
        <span>Your Bio must have at least 100 characters</span>
        <span>{bioCharCount}</span>
      </div>

      <IssuesForm
        issues={issues}
        onChange={onIssuesChange}
        initialIssues={initialIssues}
      />
    </div>
  )
}
