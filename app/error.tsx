'use client'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import { getUserCookie } from 'helpers/cookieHelper'
import Image from 'next/image'
import { useEffect } from 'react'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import Link from 'next/link'
import { reportErrorToSentry } from '@shared/sentry'

interface ErrorPayload {
  message?: string
  url?: string
  userEmail?: string
  userAgent?: string
}

interface ErrorPageProps {
  error: Error
}

export const sendError = async (payload: ErrorPayload): Promise<boolean> => {
  try {
    await clientFetch(apiRoutes.logError, payload)
    return true
  } catch (e) {
    console.log('error at sendError.', e)
    return false
  }
}

export default function Error({ error }: ErrorPageProps): React.JSX.Element {
  useEffect(() => {
    reportErrorToSentry(error)
    logError()
    if (error?.message?.startsWith('Loading chunk')) {
      window.location.reload()
    }
  }, [error])

  const logError = async (): Promise<void> => {
    const user = getUserCookie(true)
    await sendError({
      message: error?.message,
      url: window.location.href,
      userEmail: user && typeof user === 'object' ? user.email : undefined,
      userAgent: window?.navigator?.userAgent,
    })
  }
  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-3 lg:px-5">
      <div className="grid grid-cols-12 gap-4 items-center justify-center">
        <div className="col-span-12 lg:col-span-6 ">
          <div className="relative h-[50vh]">
            <Image
              src="/images/error-pages/error-500.svg"
              data-cy="logo"
              fill
              className="object-contain object-center"
              alt="Error"
              priority
            />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <H1>Error: 500 server error</H1>
          <Body1 className="my-7">
            Something went wrong. Our engineers are blaming the
            two-party-system.
          </Body1>
          <Link href="/">
            <PrimaryButton>Back to our homepage</PrimaryButton>
          </Link>
          <div className="text-sm italic mt-12">{error?.message}</div>
        </div>
      </div>
    </div>
  )
}
