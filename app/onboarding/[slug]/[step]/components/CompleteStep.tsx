'use client'
import PartyAnimation from '@shared/animations/PartyAnimation'
import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import { updateCampaign } from 'app/onboarding/shared/ajaxActions'
import { useUser } from '@shared/hooks/useUser'
import { buildTrackingAttrs, EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { useState } from 'react'
import { useSnackbar } from 'helpers/useSnackbar'
import Button from '@shared/buttons/Button'
import { clientFetch, ApiResponse } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { ONBOARDING_STEPS } from 'app/onboarding/onboarding.consts'

async function launchCampaign(): Promise<ApiResponse | false> {
  try {
    return await clientFetch(apiRoutes.campaign.launch)
  } catch (e) {
    console.log('error at launchCampaign', e)
    return false
  }
}

export default function CompleteStep() {
  const [user] = useUser()
  const [loading, setLoading] = useState(false)
  const { successSnackbar, errorSnackbar } = useSnackbar()
  const trackingAttrs = buildTrackingAttrs('Onboarding Complete Button')

  const handleSave = async () => {
    if (loading) {
      return
    }
    setLoading(true)
    successSnackbar('Saving...')

    trackEvent(EVENTS.Onboarding.CompleteStep.ClickGoToDashboard)

    const attr = [{ key: 'data.currentStep', value: ONBOARDING_STEPS.COMPLETE }]

    await updateCampaign(attr)
    const res = await launchCampaign()
    if (res && res.ok) {
      trackEvent('onboarding_complete', { type: 'candidate' })
      window.location.href = '/dashboard'
    } else {
      setLoading(false)
      errorSnackbar('Error launching your campaign')
    }
  }
  const { firstName } = user ?? {}

  return (
    <div className="text-center">
      <div className="max-w-xs m-auto mb-4">
        <PartyAnimation loop={true} />
      </div>
      <H1>Congrats{firstName ? `, ${firstName}` : ''}!</H1>
      <Body1 className="mt-4 mb-8">
        You&apos;re officially part of the GoodParty.org community. Let&apos;s
        get started!
      </Body1>
      <Button
        size="large"
        className="w-full"
        onClick={handleSave}
        {...trackingAttrs}
      >
        {loading ? 'Launching...' : 'View Dashboard'}
      </Button>
    </div>
  )
}
