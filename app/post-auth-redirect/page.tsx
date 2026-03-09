import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { getPostAuthRedirectPath } from 'app/(candidate)/dashboard/shared/candidateAccess'

export default async function PostAuthRedirect() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/login')
  }

  try {
    redirect(await getPostAuthRedirectPath())
  } catch (e) {
    if (isRedirectError(e)) throw e
    console.error('PostAuthRedirect: failed to determine redirect', e)
    redirect('/profile')
  }
}
