import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import type { Organization } from 'gpApi/api-endpoints'

/**
 * Guard for elected-office pages (briefings, polls, contacts).
 *
 * If the user's current org cookie points to a campaign org, this function
 * fetches their full org list, finds an EO org, and bounces through
 * /api/switch-org to set the cookie before redirecting back to the page
 * they originally requested.
 */
export default async function serveAccess(): Promise<void> {
  const resp = await serverFetch(apiRoutes.electedOffice.current)
  if (resp?.ok && resp?.data) {
    return // Current org already has an elected office — all good
  }

  // Current org doesn't have an EO. Check if the user has another org that does.
  const orgsResp = await serverFetch<{ organizations: Organization[] }>({
    path: '/organizations',
    method: 'GET',
  })

  const organizations = orgsResp?.data?.organizations
  if (organizations?.length) {
    const eoOrg = organizations.find((o) => o.electedOfficeId)
    if (eoOrg) {
      // User has an EO org but the wrong one is selected.
      // Redirect through the switch-org route handler which can set the cookie.
      const headersList = await headers()
      const pathname = headersList.get('x-pathname') || '/dashboard'
      return redirect(
        `/api/switch-org?slug=${encodeURIComponent(eoOrg.slug)}&redirect=${encodeURIComponent(pathname)}`,
      )
    }
  }

  // No EO org exists at all — fall back to the main dashboard
  return redirect('/dashboard')
}
