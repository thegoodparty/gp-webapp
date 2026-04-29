'use client'
import { Button, Textarea } from '@styleguide'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createWebsite,
  getUserWebsite,
  updateWebsite,
  USER_WEBSITE_QUERY_KEY,
} from 'app/dashboard/website/util/website.util'
import { useSnackbar } from 'helpers/useSnackbar'
import { Website, WebsiteIssue } from 'helpers/types'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import {
  MIN_BIO_LENGTH,
  MIN_POLICY_PRIORITIES,
} from '../candidateProfile.utils'
import PolicyPriorities from './PolicyPriorities'

const normalizeIssues = (
  raw: { title?: string; description?: string }[] | undefined,
): WebsiteIssue[] =>
  (raw ?? []).map((i) => ({
    title: i.title ?? '',
    description: i.description ?? '',
  }))

export default function CandidateProfile(): React.JSX.Element {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { errorSnackbar } = useSnackbar()
  const { data: website } = useQuery<Website | null>({
    queryKey: USER_WEBSITE_QUERY_KEY,
    queryFn: getUserWebsite,
  })

  const [bio, setBio] = useState('')
  const [issues, setIssues] = useState<WebsiteIssue[]>([])
  const [submitting, setSubmitting] = useState(false)
  const seededRef = useRef(false)

  useEffect(() => {
    if (seededRef.current || !website) return
    setBio(website.content?.about?.bio ?? '')
    setIssues(normalizeIssues(website.content?.about?.issues))
    seededRef.current = true
  }, [website])

  const trimmedBioLength = bio.trim().length
  const canSubmit =
    trimmedBioLength >= MIN_BIO_LENGTH &&
    issues.length >= MIN_POLICY_PRIORITIES &&
    !submitting

  const handleSubmit = async () => {
    if (!canSubmit) return
    trackEvent(EVENTS.Profile.CandidateProfile.ClickSubmit)
    setSubmitting(true)
    try {
      if (!website) {
        const createResp = await createWebsite()
        if (!createResp.ok) throw new Error('create failed')
      }
      const result = await updateWebsite({
        about: { ...website?.content?.about, bio, issues },
      })
      if (!result || !result.ok) throw new Error('update failed')
      trackEvent(EVENTS.Profile.CandidateProfile.SubmitSuccess)
      await queryClient.invalidateQueries({ queryKey: USER_WEBSITE_QUERY_KEY })
      router.push('/dashboard/profile')
    } catch {
      trackEvent(EVENTS.Profile.CandidateProfile.SubmitError)
      errorSnackbar('Failed to save candidate profile. Please try again.')
      setSubmitting(false)
    }
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
          <label htmlFor="why" className="mb-1.5 block text-sm font-medium">
            Why are you running?
          </label>
          <Textarea
            id="why"
            rows={5}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={submitting}
          />
          <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
            <span>{MIN_BIO_LENGTH} character minimum</span>
            <span>{trimmedBioLength}</span>
          </div>
        </div>

        <div className="mt-8">
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
