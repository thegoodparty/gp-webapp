import { getServerUser } from 'helpers/userServerHelper'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function Page(): Promise<never> {
  const user = await getServerUser()
  return redirect(user ? '/dashboard' : '/login')
}
