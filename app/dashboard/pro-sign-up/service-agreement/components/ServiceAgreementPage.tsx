'use client'
import { AlreadyProUserPrompt } from 'app/dashboard/shared/AlreadyProUserPrompt'
import { FocusedExperienceWrapper } from 'app/dashboard/shared/FocusedExperienceWrapper'
import H1 from '@shared/typography/H1'
import { MdFlag, MdPeople, MdPerson } from 'react-icons/md'
import { AcknowledgementQuestion } from '@shared/acknowledgements/AcknowledgementQuestion'
import { ChangeEvent, useState } from 'react'
import Body1 from '@shared/typography/Body1'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import SecondaryButton from '@shared/buttons/SecondaryButton'
import Link from 'next/link'
import { ServiceAgreementSignatureSection } from 'app/dashboard/pro-sign-up/service-agreement/components/ServiceAgreementSignatureSection'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { useCampaignStatus } from '@shared/hooks/useCampaignStatus'
import { Campaign } from 'helpers/types'

interface Acknowledgement {
  title: string
  emoticon: React.ReactNode
  body: React.ReactNode
  accepted?: boolean
}

interface ServiceAgreementPageProps {
  campaign: Campaign | null
}

const ACKNOWLEDGEMENTS: Acknowledgement[] = [
  {
    title: 'Independent',
    emoticon: <MdPerson className="mr-2" />,
    body: 'You must be independent of big money and the two major political parties.',
  },
  {
    title: 'People-Powered',
    emoticon: <MdPeople className="mr-2" />,
    body: 'Your campaign or administration must be centered on serving the people, only raising funds from real, living people (not corporations or special interests).',
  },
  {
    title: 'Anti-Corruption',
    emoticon: <MdFlag className="mr-2" />,
    body: 'You must serve with integrity, transparency, and be accountable to the people.',
  },
]

export const ServiceAgreementPage = ({
  campaign,
}: ServiceAgreementPageProps): React.JSX.Element => {
  const [signature, setSignature] = useState('')
  const [acknowledgements, setAcknowledgements] = useState<Acknowledgement[]>([
    ...ACKNOWLEDGEMENTS,
  ])
  const allAccepted = acknowledgements.every((ack) => ack.accepted)
  const [campaignStatus] = useCampaignStatus()
  const isVerified = campaignStatus?.['isVerified']

  const onAcknowledge =
    (index: number) =>
    (accepted: boolean): void => {
      const currentAck = acknowledgements[index]
      if (!currentAck) return
      setAcknowledgements([
        ...acknowledgements.slice(0, index),
        {
          title: currentAck.title,
          emoticon: currentAck.emoticon,
          body: currentAck.body,
          accepted,
        },
        ...acknowledgements.slice(index + 1),
      ])
    }

  const backLink = isVerified
    ? '/dashboard/pro-sign-up/'
    : '/dashboard/pro-sign-up/committee-check'

  return (
    <FocusedExperienceWrapper>
      {campaign?.isPro ? (
        <AlreadyProUserPrompt />
      ) : (
        <>
          <H1 className="pb-10 text-center">
            Lastly, do you agree to the GoodParty.org Services Agreement?
          </H1>
          <Body1 className="text-center mb-10">
            In order to use GoodParty.org Pro features you must accept each part
            of our services agreement. This agreement states that you are
            running as a 3rd party or non-partisan candidate and will adhere to
            the specified terms of service duration with provisions for
            termination, and use voter file data in compliance with all
            applicable laws exclusively for political campaigns and public
            affairs advocacy.
          </Body1>
          {acknowledgements.map((ack, index) => (
            <AcknowledgementQuestion
              key={index}
              title={ack.title}
              body={ack.body}
              show={index === 0 || acknowledgements[index - 1]?.accepted}
              acknowledged={ack.accepted}
              buttonTexts={['I Accept', 'Accept']}
              onAcknowledge={onAcknowledge(index)}
              emoticon={ack.emoticon}
              disableScrollTo={!Boolean(index)}
            />
          ))}
          <ServiceAgreementSignatureSection
            {...{
              show: allAccepted,
              signature,
              onChange: (e: ChangeEvent<HTMLInputElement>) =>
                setSignature(e.currentTarget.value),
            }}
          />
          <div className="flex flex-col justify-between md:flex-row">
            <Link href={backLink}>
              <SecondaryButton
                className="w-full mb-4 md:mb-0 md:w-auto"
                onClick={() => {
                  trackEvent(EVENTS.ProUpgrade.ServiceAgreement.ClickBack)
                }}
              >
                Back
              </SecondaryButton>
            </Link>
            <Link href="/dashboard/pro-sign-up/purchase-redirect">
              <PrimaryButton
                className="w-full md:w-auto"
                disabled={!allAccepted || !signature}
                onClick={() => {
                  trackEvent(EVENTS.ProUpgrade.ServiceAgreement.ClickFinish)
                }}
              >
                Finish
              </PrimaryButton>
            </Link>
          </div>
        </>
      )}
    </FocusedExperienceWrapper>
  )
}
