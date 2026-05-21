import { getServerUser } from 'helpers/userServerHelper'
import { redirect } from 'next/navigation'
import { getPostAuthRedirectPath } from 'app/dashboard/shared/candidateAccess'

export const dynamic = 'force-dynamic'

export default async function Page(): Promise<never> {
  const user = await getServerUser()
  return redirect(user ? await getPostAuthRedirectPath() : '/login')
}
