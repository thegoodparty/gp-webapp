import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getServerUser } from './userServerHelper'

export const requireAuth = async (redirectUrl) => {
  const user = await getServerUser()
  if (!user) {
    const cookieStore = await cookies()
    cookieStore.set('returnUrl', redirectUrl)
    redirect('/login')
  }
  return user
}
