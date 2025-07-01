import { getCookie } from 'helpers/cookieHelper'
import { USER_ROLES, userHasRole } from 'helpers/userHelper'
import { getCampaignRequests } from '@shared/utils/getCampaignRequests'
import { handleCreateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import { fetchCampaignStatus } from 'helpers/fetchCampaignStatus'

export const doLoginRedirect = async (router, user, campaign) => {
  const returnCookie = getCookie('returnUrl')
  const status = await fetchCampaignStatus()
  const campaignRequests = await getCampaignRequests(user.id)

  const redirectRoute = campaign
    ? await handleCreateCampaign(campaign)
    : campaignRequests?.length
    ? '/onboarding/managing/final'
    : returnCookie
    ? router.push(returnCookie)
    : userHasRole(user, USER_ROLES.SALES)
    ? '/sales/add-campaign'
    : status?.status === 'candidate'
    ? '/dashboard'
    : status?.status === 'volunteer'
    ? '/volunteer-dashboard'
    : '/'

  router.push(redirectRoute)
}
