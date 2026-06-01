import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import { getCurrentUserOrganizations } from 'helpers/getCurrentUserOrganizations'
import { ORG_SLUG_COOKIE } from '@shared/organizations/constants'

export default async function serveAccess(): Promise<void> {
  const resp = await serverFetch(apiRoutes.electedOffice.current)
  if (resp?.ok && resp?.data) {
    return
  }

  // The elected-office (and meetings) endpoints resolve by the selected org's
  // slug, so the lookup above fails whenever the user lands here with a
  // different org selected — e.g. a logged-in user opening a /dashboard/briefings
  // deep link from a marketing email while their campaign org is active. If the
  // user owns an elected-office org that isn't the one currently selected,
  // route through /post-auth-redirect to switch the org slug cookie and come
  // back, rather than incorrectly bouncing them to /dashboard.
  const [organizations, cookieStore] = await Promise.all([
    getCurrentUserOrganizations(),
    cookies(),
  ])
  const currentSlug = cookieStore.get(ORG_SLUG_COOKIE)?.value
  const electedOfficeOrg = organizations.find((org) => org.electedOfficeId)

  // Only redirect when switching to a *different* org could actually help.
  // If the elected-office org is already selected (or none exists), fall back
  // to /dashboard so we can't loop back here through post-auth-redirect.
  if (electedOfficeOrg && electedOfficeOrg.slug !== currentSlug) {
    return redirect('/post-auth-redirect?next=/dashboard/briefings')
  }

  return redirect('/dashboard')
}
