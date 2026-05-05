'use client'

import H3 from '@shared/typography/H3'
import Body1 from '@shared/typography/Body1'
import PrimaryButton from '@shared/buttons/PrimaryButton'
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
  MIN_POLICY_PRIORITIES,
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
  const seededRef = useRef(false)

  const websiteIssues = website?.content?.about?.issues
  useEffect(() => {
    if (seededRef.current || !website) return
    setIssues(normalizeIssues(websiteIssues))
    seededRef.current = true
  }, [website, websiteIssues])

  const canSave = issues.length >= MIN_POLICY_PRIORITIES && !saving

  const handleSave = async () => {
    if (!canSave) return
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
    setSaving(false)
  }

  return (
    <section className="border-t pt-6 border-gray-600">
      <H3>Your policy priorities</H3>
      <Body1 className="text-gray-600 mt-2 pb-6 mb-6">
        Tell potential voters about the policy priorities you&apos;ll focus on.
      </Body1>
      <PolicyPriorities
        issues={issues}
        onChange={setIssues}
        disabled={saving}
      />
      <div className="flex justify-end mt-6 mb-6">
        <PrimaryButton
          loading={saving}
          disabled={!canSave}
          onClick={handleSave}
        >
          {saving ? 'Saving...' : 'Save'}
        </PrimaryButton>
      </div>
    </section>
  )
}
