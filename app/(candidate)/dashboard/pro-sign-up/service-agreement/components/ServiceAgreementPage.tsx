'use client'
import { AlreadyProUserPrompt } from 'app/(candidate)/dashboard/shared/AlreadyProUserPrompt'
import { FocusedExperienceWrapper } from 'app/(candidate)/dashboard/shared/FocusedExperienceWrapper'
import H1 from '@shared/typography/H1'
import { MdFlag, MdPeople, MdPerson } from 'react-icons/md'
import { AcknowledgementQuestion } from '@shared/acknowledgements/AcknowledgementQuestion'
import { ChangeEvent, useState } from 'react'
import Body1 from '@shared/typography/Body1'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import SecondaryButton from '@shared/buttons/SecondaryButton'
import Link from 'next/link'
import { TermAndTerminationText } from 'app/(candidate)/dashboard/pro-sign-up/service-agreement/components/TermAndTerminationText'
import { ServiceAgreementSignatureSection } from 'app/(candidate)/dashboard/pro-sign-up/service-agreement/components/ServiceAgreementSignatureSection'
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
    body: 'I confirm that I am running as a 3rd party or non-partisan candidate and my campaign is not registered with either the Republican or the Democratic parties.',
  },
  {
    title: 'Terms & Termination',
    emoticon: <MdPeople className="mr-2" />,
    body: <TermAndTerminationText />,
  },
  {
    title: 'Voter Data Privacy',
    emoticon: <MdFlag className="mr-2" />,
    body: 'By signing and agreeing to this Services Agreement, the Data User, certifies that he/she will use any voter file data made accessible to him/her by Good Party LLC, in conformance with all federal, state and local laws whether statutory, regulatory or common law governing use of voter file data in the state or states from which those data are drawn. Data User certifies that voter data use is limited to support for political campaigns and public affairs advocacy. The Data User represents and warrants that he/she has informed himself/herself of all such applicable laws and will use the data provided only in conformity therewith. Data User shall be solely responsible for informing themself of the legal restrictions governing the user of registered voter data and shall abide by all such restrictions. The Data User further acknowledges his/her awareness of special rules for the use of cell phone numbers as governed by the Telephone Consumer Protection Act promulgated by the Federal Communications Commission. Data User represents and warrants that no data supplied by Good Party LLC will be used for immoral or illegal purposes. Good Party LLC provides no warranty, express or implied, as to the accuracy, reliability, utility or completeness of such information. The voter file data is provided on an "AS IS" basis. All warranties of any kind, express or implied, including but not limited to the IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, freedom from contamination by computer viruses and non-infringement of proprietary rights ARE DISCLAIMED. Data User should be aware that voter file data can quickly become out-of-date. Data User assumes all responsibility and risk for his/her use of the voter file data provided herein. The Data User shall defend, indemnify, and hold harmless, Good Party LLC and its affiliates and their respective directors, officers, employees, and agents from and against all claims and expenses, including attorneys\' fees and court costs, arising out of the any use by Data User of the voter file data supplied herein. The data downloaded from this platform is the exclusive property of L2 INC. Good Party LLC is a licensee. Data User has been granted a limited non-exclusive license to utilize the data downloaded from L2\'s platform for the allowable purposes. Data User acknowledges that legal privacy requirements may result in individuals requesting that Good Party LLC remove identifying information from its records and share that deletion request with Data User. Good Party LLC will comply with all such requests and Data User agrees to comply with removal of relevant records from its licensed copy of Good Party\'s data as provided under this agreement.',
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
