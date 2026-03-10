import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getPostAuthRedirectPath } from 'app/(candidate)/dashboard/shared/candidateAccess'
import { ClientRedirect } from './ClientRedirect'

export default async function PostAuthRedirect() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/login')
  }

  let path: string
  try {
    path = await getPostAuthRedirectPath()
  } catch (e) {
    console.error('PostAuthRedirect: failed to determine redirect', e)
    path = '/profile'
  }

  return <ClientRedirect path={path} />
}
