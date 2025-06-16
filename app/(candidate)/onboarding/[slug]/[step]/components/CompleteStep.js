'use client'
import PartyAnimation from '@shared/animations/PartyAnimation'
import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import { getUserCookie } from 'helpers/cookieHelper'
import {
  buildTrackingAttrs,
  trackEvent,
} from 'helpers/analyticsHelper'
import { useState } from 'react'
import { useSnackbar } from 'helpers/useSnackbar'
import Button from '@shared/buttons/Button'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

async function launchCampaign() {
  try {
    return await clientFetch(apiRoutes.campaign.launch)
  } catch (e) {
    console.log('error at launchCampaign', e)
    return false
  }
}

export default function CompleteStep() {
  const [loading, setLoading] = useState(false)
  const user = getUserCookie(true)
  const { successSnackbar, errorSnackbar } = useSnackbar()
  const trackingAttrs = buildTrackingAttrs('Onboarding Complete Button')

  const handleSave = async () => {
    if (loading) {
      return
    }
    setLoading(true)
    successSnackbar('Saving...')

    const attr = [{ key: 'data.currentStep', value: 'onboarding-complete' }]

    await updateCampaign(attr)
    const res = await launchCampaign()
    if (res.ok) {
      trackEvent('onboarding_complete', { type: 'candidate' })
      window.location.href = '/dashboard'
    } else {
      setLoading(false)
      errorSnackbar('Error launching your campaign')
    }
  }

  return (
    <div className="text-center">
      <div className="max-w-xs m-auto mb-4">
        <PartyAnimation loop={true} />
      </div>
      <H1>Congrats, {user.firstName}!</H1>
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
