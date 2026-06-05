'use client'
import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import React from 'react'
import { FocusedExperienceWrapper } from 'app/dashboard/shared/FocusedExperienceWrapper'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@styleguide'

const PurchaseSuccessPage = (): React.JSX.Element => {
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
        <Link className="text-info-main underline" href="/dashboard/profile">
          settings
        </Link>
      </Body2>
      <div className="w-full flex flex-col justify-center md:flex-row md:justify-between">
        <Button
          asChild
          variant="secondary"
          className="self-start mb-4 w-full md:w-auto md:mb-0"
        >
          <Link href="/dashboard">Go Back to Dashboard</Link>
        </Button>
        <Button asChild className="self-start w-full md:w-auto">
          <Link href="/dashboard/voter-records">Go to Voter File</Link>
        </Button>
      </div>
    </FocusedExperienceWrapper>
  )
}

export default PurchaseSuccessPage
