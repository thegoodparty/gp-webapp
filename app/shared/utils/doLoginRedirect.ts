import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { getCookie } from 'helpers/cookieHelper'
import { USER_ROLES, userHasRole } from 'helpers/userHelper'
import { doPostAuthRedirect } from 'app/onboarding/shared/ajaxActions'
import { fetchCampaignStatus } from 'helpers/fetchCampaignStatus'
import { User, Campaign } from 'helpers/types'
import { queryClient } from '@shared/query-client'
import { ORGANIZATIONS_QUERY_KEY } from '@shared/organization-picker'
import { clientRequest } from 'gpApi/typed-request'

export const doLoginRedirect = async (
  router: AppRouterInstance,
  user: User | null | undefined,
  campaign: Campaign | null | undefined,
): Promise<void> => {
  const returnCookie = getCookie('returnUrl')
  const [status] = await Promise.all([
    fetchCampaignStatus(),
    clientRequest('GET /v1/organizations', {}).then((res) =>
      queryClient.setQueryData(ORGANIZATIONS_QUERY_KEY, res.data.organizations),
    ),
  ])

  const redirectRoute: string | false | void | undefined = userHasRole(
    user,
    USER_ROLES.SALES,
  )
    ? '/sales/add-campaign'
    : campaign
    ? await doPostAuthRedirect(campaign)
    : returnCookie
    ? router.push(returnCookie)
    : status?.status === 'candidate'
    ? '/dashboard'
    : status?.status === 'onboarding' && status?.step && status?.slug
    ? `/onboarding/${status.slug}/${status.step}`
    : status?.status === 'volunteer'
    ? '/volunteer-dashboard'
    : '/onboarding/office-selection'

  router.push(redirectRoute as string)
  // The root layout's PageWrapper (server component) was initially rendered
  // before login, so its cached RSC payload has isAuthed: false and empty
  // organizations. refresh() forces it to re-render with the new auth cookie.
  router.refresh()
}
