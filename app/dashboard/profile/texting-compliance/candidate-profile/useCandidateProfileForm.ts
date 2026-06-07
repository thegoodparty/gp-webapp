'use client'
import { useEffect, useRef, useState } from 'react'
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
  getBioError,
  getBioPlainLength,
  getPolicyPrioritiesError,
  normalizeIssues,
} from './candidateProfile.utils'

export interface CandidateProfileForm {
  bio: string
  setBio: (bio: string) => void
  bioPlainLength: number
  setBioPlainLength: (length: number) => void
  issues: WebsiteIssue[]
  setIssues: (issues: WebsiteIssue[]) => void
  // `null` until the website query has settled — the bio editor must defer
  // mounting until then (see the seeding effect for why).
  initialBio: string | null
  submitting: boolean
  attemptedSubmit: boolean
  bioError: string | null
  prioritiesError: string | null
  handleSubmit: () => Promise<void>
}

interface UseCandidateProfileFormArgs {
  // What to do after a successful save. The standalone profile page routes to
  // /dashboard/profile; the Pro-upgrade wizard advances to the next step. Kept
  // a callback so the bio/issues state, seeding, and validation live in one
  // place and neither surface forks the form.
  onSaved: () => void | Promise<void>
}

/**
 * Owns the candidate-profile form: bio + policy-priorities state, one-time
 * seeding from the saved website, validation (delegated to
 * `candidateProfile.utils`), and the `saveAboutFields` submit. Consumed by both
 * the standalone profile page and the Pro-upgrade wizard step so the validators
 * and the save path can't drift between the two.
 */
export const useCandidateProfileForm = ({
  onSaved,
}: UseCandidateProfileFormArgs): CandidateProfileForm => {
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

  const handleSubmit = async (): Promise<void> => {
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
    // Re-derive completeness on both surfaces: the standalone profile reads the
    // website query, and the wizard's ProUpgradeEntry derives `profileComplete`
    // from it (so a returning candidate isn't re-prompted). Done before
    // navigating so the consumer reads fresh data.
    await queryClient.invalidateQueries({ queryKey: USER_WEBSITE_QUERY_KEY })
    await onSaved()
  }

  return {
    bio,
    setBio,
    bioPlainLength,
    setBioPlainLength,
    issues,
    setIssues,
    initialBio,
    submitting,
    attemptedSubmit,
    bioError,
    prioritiesError,
    handleSubmit,
  }
}
