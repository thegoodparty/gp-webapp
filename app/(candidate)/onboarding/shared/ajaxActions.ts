'use client'

import { deleteCookie, getCookie } from 'helpers/cookieHelper'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { ONBOARDING_STEPS } from 'app/(candidate)/onboarding/onboarding.consts'
import { Campaign } from 'helpers/types'

type UpdateValue = string | number | boolean | object | null | undefined
type UpdateObject = Partial<Record<string, UpdateValue>>
type UpdateAttribute = { key: string; value: UpdateValue }
type CampaignVersions = Partial<
  Record<string, string | number | boolean | object | null>
>
type CampaignWithCurrentStep = Campaign & { currentStep?: string }

export const updateCampaign = async (
  attr: UpdateAttribute[] | UpdateAttribute,
  slug?: string,
): Promise<Campaign | false> => {
  try {
    const normalizedAttr = Array.isArray(attr) ? attr : [attr]

    // TODO: update callers of this function to use the new api format
    // convert the attr array to an object formatted for new api
    const updates = normalizedAttr.reduce<UpdateObject>(
      (acc, { key, value }) => {
        const keys = key.split('.')
        let current = acc
        keys.forEach((segment, index) => {
          if (index === keys.length - 1) {
            // Set the leaf value.
            current[segment] = value
          } else {
            // Ensure the parent exists and is an object.
            const next = current[segment]
            const nextObject =
              typeof next === 'object' && next !== null ? next : {}
            current[segment] = nextObject
            current = nextObject
          }
        })
        return acc
      },
      {},
    )

    const payload = {
      ...updates,
      slug, // admin only
    }
    const resp = await clientFetch<Campaign>(apiRoutes.campaign.update, payload)
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}

/**
 * @returns {Promise<import('helpers/types').Campaign | false>}
 */
export const getCampaign = async (): Promise<Campaign | false> => {
  try {
    const resp = await clientFetch<Campaign>(apiRoutes.campaign.get)
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export const fetchCampaignVersions = async (): Promise<CampaignVersions> => {
  try {
    const resp = await clientFetch<CampaignVersions>(
      apiRoutes.campaign.planVersion,
    )
    return resp.data
  } catch (e) {
    console.log('error at fetchCampaignVersions', e)
    return {}
  }
}

export const parseNumericOnboardingStep = (currentStep = '') =>
  parseInt(`${currentStep || ''}`.replace(/\D/g, '') || '0')

export const onboardingStep = (
  campaign: CampaignWithCurrentStep | null | undefined,
  step: number,
): string => {
  const numericStep = parseNumericOnboardingStep(campaign?.currentStep)

  const nextStep = Math.max(numericStep, step)
  return `onboarding-${nextStep}`
}

// TODO: Refactor/break this up. It's doing WAY too much for one method and is
//  VERY confusing and brittle.
export const doPostAuthRedirect = async (
  existingCampaign?: Campaign | null,
): Promise<string | false | undefined> => {
  try {
    let campaign = existingCampaign
    if (!campaign) {
      const resp = await clientFetch<Campaign>(apiRoutes.campaign.create)
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
    return undefined
  } catch (e) {
    return false
  }
}
