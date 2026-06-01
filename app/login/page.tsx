import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { SignIn } from '@clerk/nextjs'
import { getPostAuthRedirectPath } from 'app/dashboard/shared/candidateAccess'
import pageMetaData from 'helpers/metadataHelper'

const meta = pageMetaData({
  title: 'Login',
  description: 'Login to GoodParty.org.',
  slug: '/login',
})
export const metadata = meta

export default async function LoginPage({
  searchParams,
}: PageProps<any>): Promise<React.JSX.Element> {
  const { userId } = await auth()
  if (userId) {
    redirect(await getPostAuthRedirectPath())
  }

  // When the middleware bounces an unauthenticated deep link (e.g.
  // /dashboard/briefings from a marketing email) through here, it preserves
  // the original path in `redirect_url`. We can't send the user straight there
  // after sign-in: `/post-auth-redirect` is what resolves the user's org and
  // sets the ORG_SLUG_COOKIE that server requests need, so skipping it leaves
  // pages like briefings without org context (blank render / server-side
  // bounce to /dashboard). Instead, always route through `/post-auth-redirect`
  // and forward the requested path as `next` so it can land the user there
  // once setup is done. Only same-origin relative paths are honored so the
  // param can't be abused as an open redirect.
  const { redirect_url: redirectUrlParam } = await searchParams
  const redirectUrl =
    typeof redirectUrlParam === 'string' &&
    redirectUrlParam.startsWith('/') &&
    !redirectUrlParam.startsWith('//')
      ? redirectUrlParam
      : null
  const forceRedirectUrl = redirectUrl
    ? `/post-auth-redirect?next=${encodeURIComponent(redirectUrl)}`
    : null

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-8">
      <SignIn
        {...(forceRedirectUrl
          ? { forceRedirectUrl }
          : { fallbackRedirectUrl: '/post-auth-redirect' })}
        routing="hash"
      />
    </div>
  )
}
