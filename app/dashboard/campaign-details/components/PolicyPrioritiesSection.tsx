'use client'

import H3 from '@shared/typography/H3'
import Body1 from '@shared/typography/Body1'
import { Alert, AlertDescription, Button, CircleAlertIcon } from '@styleguide'
import { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getUserWebsite,
  saveAboutFields,
  USER_WEBSITE_QUERY_KEY,
} from 'app/dashboard/website/util/website.util'
import { useSnackbar } from 'helpers/useSnackbar'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { Website, WebsiteIssue } from 'helpers/types'
import {
  getPolicyPrioritiesError,
  normalizeIssues,
} from 'app/dashboard/profile/texting-compliance/candidate-profile/candidateProfile.utils'
import PolicyPriorities from 'app/dashboard/profile/texting-compliance/candidate-profile/components/PolicyPriorities'

export default function PolicyPrioritiesSection(): React.JSX.Element {
  const queryClient = useQueryClient()
  const { errorSnackbar, successSnackbar } = useSnackbar()
  const { data: website } = useQuery<Website | null>({
    queryKey: USER_WEBSITE_QUERY_KEY,
    queryFn: getUserWebsite,
  })

  const [issues, setIssues] = useState<WebsiteIssue[]>([])
  const [saving, setSaving] = useState(false)
  // The Save button is always enabled so the user can attempt to save and get
  // a guiding error rather than a silently-disabled button. The error only
  // surfaces once they've tried to save.
  const [attemptedSave, setAttemptedSave] = useState(false)
  const seededRef = useRef(false)

  const websiteIssues = website?.content?.about?.issues
  useEffect(() => {
    if (seededRef.current || !website) return
    setIssues(normalizeIssues(websiteIssues))
    seededRef.current = true
  }, [website, websiteIssues])

  const prioritiesError = getPolicyPrioritiesError(issues.length)

  const handleSave = async () => {
    if (saving) return
    if (prioritiesError) {
      setAttemptedSave(true)
      return
    }
    trackEvent(EVENTS.Profile.PolicyPriorities.ClickSave)
    setSaving(true)
    const ok = await saveAboutFields({ issues })
    if (!ok) {
      errorSnackbar('Failed to save policy priorities. Please try again.')
      setSaving(false)
      return
    }
    await queryClient.invalidateQueries({ queryKey: USER_WEBSITE_QUERY_KEY })
    successSnackbar('Policy priorities saved')
    // Clear the attempted-save flag so a later edit back to an invalid state
    // doesn't re-show the error before the user tries to save again.
    setAttemptedSave(false)
    setSaving(false)
  }

  return (
    <section>
      <H3>Your policy priorities</H3>
      <Body1 className="text-gray-600 mt-2 pb-6 mb-6">
        Tell potential voters about the policy priorities you&apos;ll focus on.
      </Body1>
      {attemptedSave && prioritiesError && (
        <Alert
          variant="destructive"
          icon={<CircleAlertIcon />}
          className="mb-4"
        >
          <AlertDescription>{prioritiesError}</AlertDescription>
        </Alert>
      )}
      <PolicyPriorities
        issues={issues}
        onChange={setIssues}
        disabled={saving}
      />
      <div className="flex justify-end mt-6">
        <Button loading={saving} disabled={saving} onClick={handleSave}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </section>
  )
}
