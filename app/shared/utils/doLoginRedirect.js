import { getCookie } from 'helpers/cookieHelper'
import { fetchCampaignStatus } from 'helpers/fetchCampaignStatus'
import { createCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import { USER_ROLES, userHasRole } from 'helpers/userHelper'
import { getCampaignRequests } from '@shared/utils/getCampaignRequests'

export const doLoginRedirect = async (router, user) => {
  const returnCookie = getCookie('returnUrl')
  const status = await fetchCampaignStatus()
  const campaignRequests = await getCampaignRequests(user.id)

  const redirectRoute =
    status?.status === false
      ? await createCampaign()
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
