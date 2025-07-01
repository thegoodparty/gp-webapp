'use client'

import { deleteCookie, getCookie } from 'helpers/cookieHelper'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { ONBOARDING_STEPS } from 'app/(candidate)/onboarding/onboarding.consts'

export async function updateCampaign(attr, slug) {
  try {
    if (!Array.isArray(attr) && typeof attr === 'object') {
      attr = [attr]
    }

    // TODO: update callers of this function to use the new api format
    // convert the attr array to an object formatted for new api
    const updates = attr.reduce((acc, { key, value }) => {
      const keys = key.split('.')
      let current = acc
      keys.forEach((k, index) => {
        if (index === keys.length - 1) {
          // Set the leaf value.
          current[k] = value
        } else {
          // Ensure the parent exists and is an object.
          if (!current[k] || typeof current[k] !== 'object') {
            current[k] = {}
          }
          current = current[k]
        }
      })
      return acc
    }, {})

    const payload = {
      ...updates,
      slug, // admin only
    }
    const resp = await clientFetch(apiRoutes.campaign.update, payload)
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export async function getCampaign() {
  try {
    const resp = await clientFetch(apiRoutes.campaign.get)
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export async function fetchCampaignVersions() {
  try {
    const resp = await clientFetch(apiRoutes.campaign.planVersion)
    return resp.data
  } catch (e) {
    console.log('error at fetchCampaignVersions', e)
    return {}
  }
}

export const parseNumericOnboardingStep = (currentStep = '') =>
  parseInt(`${currentStep || ''}`.replace(/\D/g, '') || 0)

export function onboardingStep(campaign, step) {
  const numericStep = parseNumericOnboardingStep(campaign?.currentStep)

  const nextStep = Math.max(numericStep, step)
  return `onboarding-${nextStep}`
}

// TODO: Refactor/break this up. It's doing WAY too much for one method and is
//  VERY confusing and brittle.
export async function doPostAuthRedirect(existingCampaign) {
  try {
    let campaign = existingCampaign
    if (!campaign) {
      const resp =
        existingCampaign || (await clientFetch(apiRoutes.campaign.create))
      campaign = resp.data
    }
    const { slug, data: campaignData } = campaign || {}
    const { currentStep } = campaignData || {}

    if (slug) {
      deleteCookie('afterAction')
      deleteCookie('returnUrl')

      // claim profile from candidate page. save it to the new campaign
      const claimProfile = getCookie('claimProfile')
      if (claimProfile) {
        await updateCampaign([
          { key: 'data.claimProfile', value: claimProfile },
        ])
        deleteCookie('claimProfile')
      }

      return currentStep === ONBOARDING_STEPS.COMPLETE
        ? '/dashboard'
        : `/onboarding/${slug}/${parseNumericOnboardingStep(currentStep) + 1}`
    }
  } catch (e) {
    return false
  }
}

export async function updateUserMeta(meta) {
  try {
    const resp = await clientFetch(apiRoutes.user.updateMeta, { meta })
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}
