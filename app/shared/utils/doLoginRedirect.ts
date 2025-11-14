import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { getCookie } from 'helpers/cookieHelper'
import { USER_ROLES, userHasRole } from 'helpers/userHelper'
import { doPostAuthRedirect } from 'app/(candidate)/onboarding/shared/ajaxActions'
import { fetchCampaignStatus } from 'helpers/fetchCampaignStatus'
import { User, Campaign } from 'helpers/types'

export const doLoginRedirect = async (
  router: AppRouterInstance,
  user: User | null | undefined,
  campaign: Campaign | null | undefined,
): Promise<void> => {
  const returnCookie = getCookie('returnUrl')
  const status = await fetchCampaignStatus()

  const redirectRoute = userHasRole(user, USER_ROLES.SALES)
    ? '/sales/add-campaign'
    : campaign
    ? await doPostAuthRedirect(campaign)
    : returnCookie
    ? returnCookie
    : status?.status === 'candidate'
    ? '/dashboard'
    : status?.status === 'volunteer'
    ? '/volunteer-dashboard'
    : '/'

  router.push(typeof redirectRoute === 'string' ? redirectRoute : '/')
}

