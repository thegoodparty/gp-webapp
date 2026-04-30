'use client'
import { Button } from '@styleguide'
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
  MIN_POLICY_PRIORITIES,
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
  const { data: website } = useQuery<Website | null>({
    queryKey: USER_WEBSITE_QUERY_KEY,
    queryFn: getUserWebsite,
  })

  const [bio, setBio] = useState('')
  const [bioPlainLength, setBioPlainLength] = useState(0)
  const [issues, setIssues] = useState<WebsiteIssue[]>([])
  const [submitting, setSubmitting] = useState(false)
  const seededRef = useRef(false)

  useEffect(() => {
    if (seededRef.current || !website) return
    setBio(website.content?.about?.bio ?? '')
    setIssues(normalizeIssues(website.content?.about?.issues))
    seededRef.current = true
  }, [website])

  const initialBio = website?.content?.about?.bio ?? ''

  const canSubmit =
    bioPlainLength >= MIN_BIO_LENGTH &&
    issues.length >= MIN_POLICY_PRIORITIES &&
    !submitting

  const handleSubmit = async () => {
    if (!canSubmit) return
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

        <div className="mt-10">
          <div className="mb-1.5 block text-sm font-medium">
            Why are you running?
          </div>
          <RichEditor
            initialText={initialBio}
            onChangeCallback={setBio}
            onTextLengthChange={setBioPlainLength}
          />
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
          disabled={!canSubmit}
          loading={submitting}
          loadingText="Submitting"
        >
          Submit
        </Button>
      </div>
    </div>
  )
}
