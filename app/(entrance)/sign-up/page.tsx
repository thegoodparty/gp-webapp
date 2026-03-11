import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { SignUp } from '@clerk/nextjs'
import { getPostAuthRedirectPath } from 'app/(candidate)/dashboard/shared/candidateAccess'
import pageMetaData from 'helpers/metadataHelper'

const meta = pageMetaData({
  title: 'Sign up to GoodParty.org',
  description: 'Sign up to GoodParty.org.',
  slug: '/sign-up',
})
export const metadata = meta

export default async function SignUpPage() {
  const { userId } = await auth()
  if (userId) {
    redirect(await getPostAuthRedirectPath())
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-8">
      <SignUp
        fallbackRedirectUrl="/onboarding/office-selection"
        routing="hash"
      />
    </div>
  )
}
