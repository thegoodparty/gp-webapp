'use client'
import { Alert, AlertDescription, Button, CircleAlertIcon } from '@styleguide'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getUserWebsite,
  saveAboutFields,
  USER_WEBSITE_QUERY_KEY,
} from 'app/dashboard/website/util/website.util'
import { useSnackbar } from 'helpers/useSnackbar'
import { Website, WebsiteIssue } from 'helpers/types'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import {
  MIN_BIO_LENGTH,
  getBioError,
  getBioPlainLength,
  getPolicyPrioritiesError,
  normalizeIssues,
} from '../candidateProfile.utils'
import PolicyPriorities from './PolicyPriorities'

const RichEditor = dynamic(() => import('app/shared/utils/RichEditor'), {
  ssr: false,
  loading: () => (
    <div className="rounded-md border border-input bg-white px-3 py-2 text-sm text-muted-foreground">
      Loading editor…
    </div>
  ),
})

export default function CandidateProfile(): React.JSX.Element {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { errorSnackbar } = useSnackbar()
  const { data: website, isSuccess } = useQuery<Website | null>({
    queryKey: USER_WEBSITE_QUERY_KEY,
    queryFn: getUserWebsite,
  })

  const [bio, setBio] = useState('')
  const [bioPlainLength, setBioPlainLength] = useState(0)
  const [issues, setIssues] = useState<WebsiteIssue[]>([])
  const [submitting, setSubmitting] = useState(false)
  // The Submit button is always enabled so the user can attempt to submit and
  // get a guiding error rather than a silently-disabled button. Errors (alert
  // + red bio border) only surface once they've tried to submit.
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  // `initialBio` must be captured exactly once and never change afterward.
  // RichEditor re-pastes its content whenever `initialText` changes by value,
  // so deriving it live from the query would clobber the user's in-progress
  // edits whenever a refetch lands (e.g. the post-submit `invalidateQueries`
  // or a window-focus refetch). `null` means "not seeded yet" so we defer
  // mounting the editor until we have the real value.
  const [initialBio, setInitialBio] = useState<string | null>(null)
  const seededRef = useRef(false)

  useEffect(() => {
    // Seed once the website query has settled, not only when `website` is
    // truthy. A candidate who hasn't created a website yet resolves to `null`
    // here (saveAboutFields creates the site on submit), so gating on a truthy
    // `website` would leave `initialBio` null forever and the bio editor would
    // never mount — the field would be completely absent. Seed from an empty
    // bio in that case so the editor renders and they can fill it in.
    if (seededRef.current || !isSuccess) return
    const initialBioValue = website?.content?.about?.bio ?? ''
    setBio(initialBioValue)
    // Seed length up-front so Submit doesn't show a false "add your bio" error
    // before the dynamically-imported editor emits its first onTextLengthChange.
    setBioPlainLength(getBioPlainLength(initialBioValue))
    setInitialBio(initialBioValue)
    setIssues(normalizeIssues(website?.content?.about?.issues))
    seededRef.current = true
  }, [isSuccess, website])

  // Funnel "viewed" event for the agentic compliance flow (ENG-10294). The
  // matching "submitted" signal is the existing SubmitSuccess event below.
  useEffect(() => {
    trackEvent(EVENTS.ProUpgrade.Compliance.CandidateProfileViewed)
  }, [])

  const bioError = getBioError(bioPlainLength)
  const prioritiesError = getPolicyPrioritiesError(issues.length)

  const handleSubmit = async () => {
    if (submitting) return
    if (bioError || prioritiesError) {
      setAttemptedSubmit(true)
      return
    }
    trackEvent(EVENTS.Profile.CandidateProfile.ClickSubmit)
    setSubmitting(true)
    const ok = await saveAboutFields({ bio, issues })
    if (!ok) {
      trackEvent(EVENTS.Profile.CandidateProfile.SubmitError)
      errorSnackbar('Failed to save candidate profile. Please try again.')
      setSubmitting(false)
      return
    }
    trackEvent(EVENTS.Profile.CandidateProfile.SubmitSuccess)
    await queryClient.invalidateQueries({ queryKey: USER_WEBSITE_QUERY_KEY })
    router.push('/dashboard/profile')
  }

  return (
    <div className="flex h-screen flex-col items-center justify-between pt-2 md:pt-4">
      <div className="mx-auto w-full max-w-2xl p-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard/profile" aria-label="Back to profile">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <div className="font-medium md:text-xl">Candidate profile</div>
          <div>&nbsp;</div>
        </div>

        {attemptedSubmit && (bioError || prioritiesError) && (
          <Alert
            variant="destructive"
            icon={<CircleAlertIcon />}
            className="mt-6"
          >
            <AlertDescription>
              {bioError && <p>{bioError}</p>}
              {prioritiesError && <p>{prioritiesError}</p>}
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-10">
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
      </div>

      <div className="mx-auto flex w-full max-w-2xl justify-end p-4 md:p-8">
        <Button
          variant="secondary"
          type="button"
          onClick={handleSubmit}
          loading={submitting}
          loadingText="Submitting"
        >
          Submit
        </Button>
      </div>
    </div>
  )
}
