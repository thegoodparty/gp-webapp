'use client'
import Button from '@shared/buttons/Button'
import { useCampaign } from '@shared/hooks/useCampaign'
import Body1 from '@shared/typography/Body1'
import Body2 from '@shared/typography/Body2'
import H2 from '@shared/typography/H2'
import Overline from '@shared/typography/Overline'
import Paper from '@shared/utils/Paper'
import { AlertBanner } from 'app/(candidate)/dashboard/components/AlertBanner'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ReviewStep() {
  const [campaign] = useCampaign()
  const router = useRouter()
  const handleNext = async () => {
    await updateCampaign([
      {
        key: 'details.complianceStatus',
        value: 'submitted',
      },
    ])

    router.push('/dashboard/text-messaging')
  }

  const { details } = campaign || {}
  const { website, campaignEmail, einNumber } = details || {}

  return (
    <Paper className="mt-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <H2>Confirm Information</H2>
        <Body1 className="mb-8 mt-2">
          Please confirm the following information for your compliance review:
        </Body1>
        <Overline className="mb-1">EIN</Overline>
        <Body2>{einNumber}</Body2>
        <Overline className="mb-1 mt-4">Website</Overline>
        <Body2>{website}</Body2>
        <Overline className="mb-1 mt-4">Campaign Email</Overline>
        <Body2>{campaignEmail}</Body2>
      </div>
      <AlertBanner
        message="By clicking Finish you certify all information is correct and.... Once approved we will work with the mobile carrier to get your text messaging campaign live. This can take up to 10 business days."
        type="info"
      />
      <div className="mt-8 flex justify-between">
        <Link href="/dashboard/text-messaging/p2p-setup/email">
          <Button color="neutral" className="mr-4">
            Back
          </Button>
        </Link>
        <Button onClick={handleNext} color="secondary">
          Finish
        </Button>
      </div>
    </Paper>
  )
}
