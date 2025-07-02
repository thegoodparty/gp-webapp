import { getCookie } from 'helpers/cookieHelper'
import { USER_ROLES, userHasRole } from 'helpers/userHelper'
import { doPostAuthRedirect } from 'app/(candidate)/onboarding/shared/ajaxActions'
import { fetchCampaignStatus } from 'helpers/fetchCampaignStatus'

export const doLoginRedirect = async (router, user, campaign) => {
  const returnCookie = getCookie('returnUrl')
  const status = await fetchCampaignStatus()

  const redirectRoute = userHasRole(user, USER_ROLES.SALES)
    ? '/sales/add-campaign'
    : campaign
    ? await doPostAuthRedirect(campaign)
    : returnCookie
    ? router.push(returnCookie)
    : status?.status === 'candidate'
    ? '/dashboard'
    : status?.status === 'volunteer'
    ? '/volunteer-dashboard'
    : '/'

  router.push(redirectRoute)
}
