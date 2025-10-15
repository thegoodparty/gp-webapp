import { redirect } from 'next/navigation'
import { getServerUser } from './userServerHelper'

export const requireAuth = async (redirectUrl) => {
  const user = await getServerUser()
  if (!user) {
    redirect(`/login`)
  }
  return user
}
