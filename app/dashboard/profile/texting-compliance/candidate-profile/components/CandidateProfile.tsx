'use client'
import { Button, Textarea } from '@styleguide'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useCampaign } from '@shared/hooks/useCampaign'
import { CAMPAIGN_QUERY_KEY } from '@shared/hooks/CampaignProvider'
import { updateCampaign } from 'app/onboarding/shared/ajaxActions'
import { useSnackbar } from 'helpers/useSnackbar'
import { CustomIssue } from 'helpers/types'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import {
  MIN_BIO_LENGTH,
  MIN_POLICY_PRIORITIES,
} from '../candidateProfile.utils'
import PolicyPriorities from './PolicyPriorities'

export default function CandidateProfile(): React.JSX.Element {
  const [campaign] = useCampaign()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { errorSnackbar } = useSnackbar()

  const [whyRunning, setWhyRunning] = useState('')
  const [customIssues, setCustomIssues] = useState<CustomIssue[]>([])
  const [submitting, setSubmitting] = useState(false)
  const seededRef = useRef(false)

  useEffect(() => {
    if (seededRef.current || !campaign?.details) return
    setWhyRunning(campaign.details.whyRunning ?? '')
    setCustomIssues(campaign.details.customIssues ?? [])
    seededRef.current = true
  }, [campaign])

  const trimmedWhyRunningLength = whyRunning.trim().length
  const canSubmit =
    trimmedWhyRunningLength >= MIN_BIO_LENGTH &&
    customIssues.length >= MIN_POLICY_PRIORITIES &&
    !submitting

  const handleSubmit = async () => {
    if (!canSubmit) return
    trackEvent(EVENTS.Profile.CandidateProfile.ClickSubmit)
    setSubmitting(true)
    const result = await updateCampaign([
      { key: 'details.whyRunning', value: whyRunning },
      { key: 'details.customIssues', value: customIssues },
    ])
    if (!result) {
      trackEvent(EVENTS.Profile.CandidateProfile.SubmitError)
      errorSnackbar('Failed to save candidate profile. Please try again.')
      setSubmitting(false)
      return
    }
    trackEvent(EVENTS.Profile.CandidateProfile.SubmitSuccess)
    await queryClient.invalidateQueries({ queryKey: CAMPAIGN_QUERY_KEY })
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
          <label htmlFor="why" className="mb-1.5 block text-sm font-medium">
            Why are you running?
          </label>
          <Textarea
            id="why"
            rows={5}
            value={whyRunning}
            onChange={(e) => setWhyRunning(e.target.value)}
            disabled={submitting}
          />
          <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
            <span>{MIN_BIO_LENGTH} character minimum</span>
            <span>{trimmedWhyRunningLength}</span>
          </div>
        </div>

        <div className="mt-8">
          <PolicyPriorities
            issues={customIssues}
            onChange={setCustomIssues}
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
