'use client'
import ChecklistAnimation from '@shared/animations/ChecklistAnimation'
import NeedHelpAnimation from '@shared/animations/NeedHelpAnimation'
import Button from '@shared/buttons/Button'
import { useCampaign } from '@shared/hooks/useCampaign'
import Body1 from '@shared/typography/Body1'
import H2 from '@shared/typography/H2'
import H3 from '@shared/typography/H3'
import Paper from '@shared/utils/Paper'
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
    <>
      <Paper className="mt-8">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6 lg:col-span-8">
            <H2>Compliance Review</H2>
            <Body1 className="mb-8 mt-2">
              Please review the following information and click next to
              continue.
            </Body1>
            <div className="max-w-xl text-lg">
              <ul>
                <li className="pb-2">
                  <strong>EIN:</strong> {einNumber}
                </li>
                <li className="pb-2">
                  <strong>Website:</strong> {website}
                </li>
                <li className="pb-2">
                  <strong>Campaign Email:</strong> {campaignEmail}
                </li>
              </ul>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <div className="relative w-72 xl:w-96">
              <ChecklistAnimation />
            </div>
          </div>
          <div className="col-span-12 mt-2 flex justify-center">
            <Link href="/dashboard/text-messaging/p2p-setup/ein">
              <Button color="neutral" className="mr-4">
                Back
              </Button>
            </Link>
            <Button onClick={handleNext}>Submit</Button>
          </div>
        </div>
      </Paper>
      <Paper className="mt-8">
        <div className="flex justify-between">
          <div>
            <H3>What will happen next?</H3>
            <Body1 className="mt-2">
              We will work with the mobile carrier to get your campaign
              approved. This process can take up to 10 business days.
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
