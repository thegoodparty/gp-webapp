'use client'
import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import React, { useEffect } from 'react'
import { FocusedExperienceWrapper } from 'app/(candidate)/dashboard/shared/FocusedExperienceWrapper'
import Link from 'next/link'
import SecondaryButton from '@shared/buttons/SecondaryButton'
import Image from 'next/image'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { trackEvent } from 'helpers/analyticsHelper'

const PurchaseSuccessPage = () => {
  useEffect(() => {
    trackEvent('pro_upgrade_complete', { pro: true })
  }, [])
  return (
    <FocusedExperienceWrapper className="flex flex-col items-center">
      <Image
        className="mx-auto mb-8"
        src="/images/emojis/party-popper.svg"
        width={80}
        height={80}
        alt="clap"
      />
      <H1 className="text-center mb-4">
        You are now subscribed to GoodParty.org Pro!
      </H1>
      <Body2 className="text-center mb-8">
        Our team is working to pull your path to victory numbers and your voter
        file data. This will take less than 2 business days.
        <br />
        <br />
        As a reminder you will be billed monthly for your subscription, until
        your election date, but can cancel or reactivate anytime in your{' '}
        <Link className="text-info-main underline" href="/profile">
          settings
        </Link>
      </Body2>
      <div className="w-full flex flex-col justify-center md:flex-row md:justify-between">
        <Link
          className="block self-start mb-4 w-full md:w-auto md:mb-0"
          href="/dashboard"
        >
          <SecondaryButton className="w-full">
            Go Back to Dashboard
          </SecondaryButton>
        </Link>
        <Link
          className="block self-start w-full md:w-auto"
          href="/dashboard/voter-records"
        >
          <PrimaryButton className="w-full">Go to Voter File</PrimaryButton>
        </Link>
      </div>
    </FocusedExperienceWrapper>
  )
}

export default PurchaseSuccessPage
