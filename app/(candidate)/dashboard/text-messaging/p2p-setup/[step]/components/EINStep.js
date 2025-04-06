'use client'
import NeedHelpAnimation from '@shared/animations/NeedHelpAnimation'
import Button from '@shared/buttons/Button'
import { useCampaign } from '@shared/hooks/useCampaign'
import Body1 from '@shared/typography/Body1'
import H2 from '@shared/typography/H2'
import H3 from '@shared/typography/H3'
import Paper from '@shared/utils/Paper'
import { EinCheckInput } from 'app/(candidate)/dashboard/pro-sign-up/committee-check/components/EinCheckInput'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EINStep() {
  const [campaign] = useCampaign()
  const [einNumber, setEinNumber] = useState(campaign?.details?.einNumber)
  const [validatedEin, setValidatedEin] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setEinNumber(campaign?.details?.einNumber)
  }, [campaign])

  const handleEinChange = (value) => {
    setEinNumber(value)
    setValidatedEin(null)
  }

  const handleNext = async () => {
    setLoading(true)
    await updateCampaign([
      {
        key: 'details.einNumber',
        value: einNumber,
      },
    ])
    router.push('/dashboard/text-messaging/p2p-setup/website')
  }

  const canSubmit = !loading && einNumber && einNumber.length === 10

  return (
    <>
      <Paper className="mt-8">
        <H2>EIN (Employer Identification Number)</H2>
        <Body1 className="mb-8 mt-2">
          EIN is required to register a political brand with The Campaign
          Registry (TCR). All political entities must have a valid EIN to
          initiate the compliance process.
        </Body1>
        <div className="max-w-xl">
          <EinCheckInput
            value={einNumber}
            onChange={handleEinChange}
            validated={validatedEin}
            setValidated={setValidatedEin}
          />
        </div>
        <div className="mt-2 flex justify-center">
          <Link href="/dashboard/text-messaging">
            <Button color="neutral" className="mr-4">
              Back
            </Button>
          </Link>
          <Button onClick={handleNext} disabled={!canSubmit}>
            {loading ? 'Loading...' : 'Next'}
          </Button>
        </div>
      </Paper>
      <Paper className="mt-8">
        <div className="flex justify-between">
          <div>
            <H3>I don't have an EIN</H3>
            <Body1 className="mt-2">
              If you don't have an EIN,{' '}
              <a
                href="https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                you can apply for one here
              </a>
            </Body1>
          </div>
          <div className="w-48 lg:w-96 relative">
            <NeedHelpAnimation />
          </div>
        </div>
      </Paper>
    </>
  )
}
