'use client'
import { Alert, AlertDescription, CircleAlertIcon } from '@styleguide'
import dynamic from 'next/dynamic'
import { MIN_BIO_LENGTH } from '../candidateProfile.utils'
import type { CandidateProfileForm } from '../useCandidateProfileForm'
import PolicyPriorities from './PolicyPriorities'

const RichEditor = dynamic(() => import('app/shared/utils/RichEditor'), {
  ssr: false,
  loading: () => (
    <div className="rounded-md border border-input bg-white px-3 py-2 text-sm text-muted-foreground">
      Loading editor…
    </div>
  ),
})

interface CandidateProfileFieldsProps {
  form: CandidateProfileForm
}

/**
 * The candidate-profile form body — validation alert, bio editor, and policy
 * priorities — driven entirely by `useCandidateProfileForm`. Rendered by both
 * the standalone profile page and the Pro-upgrade wizard step; each supplies its
 * own heading and submit control around these shared fields.
 */
export default function CandidateProfileFields({
  form,
}: CandidateProfileFieldsProps): React.JSX.Element {
  const {
    bioPlainLength,
    setBio,
    setBioPlainLength,
    issues,
    setIssues,
    initialBio,
    submitting,
    attemptedSubmit,
    bioError,
    prioritiesError,
  } = form

  return (
    <>
      {attemptedSubmit && (bioError || prioritiesError) && (
        <Alert
          variant="destructive"
          icon={<CircleAlertIcon />}
          className="mb-6"
        >
          <AlertDescription>
            {bioError && <p>{bioError}</p>}
            {prioritiesError && <p>{prioritiesError}</p>}
          </AlertDescription>
        </Alert>
      )}

      <div>
        <div className="mb-1.5 block text-sm font-medium">
          Why are you running?
        </div>
        {initialBio !== null && (
          <RichEditor
            initialText={initialBio}
            onChangeCallback={setBio}
            onTextLengthChange={setBioPlainLength}
            error={attemptedSubmit && !!bioError}
          />
        )}
        <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
          <span>{MIN_BIO_LENGTH} character minimum</span>
          <span>{bioPlainLength}</span>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-1.5 block text-sm font-medium">
          Your policy priorities
        </div>
        <PolicyPriorities
          issues={issues}
          onChange={setIssues}
          disabled={submitting}
        />
      </div>
    </>
  )
}
