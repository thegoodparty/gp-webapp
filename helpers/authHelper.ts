import { redirect } from 'next/navigation'
import { getServerUser } from './userServerHelper'
import { User } from './types'

export const requireAuth = async (): Promise<User> => {
  const user = await getServerUser()
  if (!user) {
    redirect(`/login`)
  }
  return user
}

