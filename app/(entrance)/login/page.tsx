import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { SignIn } from '@clerk/nextjs'
import { getPostAuthRedirectPath } from 'app/(candidate)/dashboard/shared/candidateAccess'
import pageMetaData from 'helpers/metadataHelper'

const meta = pageMetaData({
  title: 'Login',
  description: 'Login to GoodParty.org.',
  slug: '/login',
})
export const metadata = meta

export default async function LoginPage() {
  const { userId } = await auth()
  if (userId) {
    redirect(await getPostAuthRedirectPath())
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-8">
      <SignIn fallbackRedirectUrl="/post-auth-redirect" routing="hash" />
    </div>
  )
}
