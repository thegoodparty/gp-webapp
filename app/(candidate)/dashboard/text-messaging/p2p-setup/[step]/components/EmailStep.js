'use client'
import Button from '@shared/buttons/Button'
import { useCampaign } from '@shared/hooks/useCampaign'
import Body1 from '@shared/typography/Body1'
import H2 from '@shared/typography/H2'
import Paper from '@shared/utils/Paper'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import EmailInput, { isValidEmail } from '@shared/inputs/EmailInput'
import { useUser } from '@shared/hooks/useUser'
import H4 from '@shared/typography/H4'
import Body2 from '@shared/typography/Body2'

export default function EmailStep() {
  const [campaign] = useCampaign()
  const [user] = useUser()
  const [email, setEmail] = useState(
    campaign?.details?.campaignEmail || user?.email,
  )
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setEmail(campaign?.details?.campaignEmail || user?.email)
  }, [campaign, user])

  const handleEmailChange = (value) => {
    setEmail(value)
  }

  const handleNext = async () => {
    setLoading(true)
    await updateCampaign([
      {
        key: 'details.campaignEmail',
        value: email,
      },
    ])
    router.push('/dashboard/text-messaging/p2p-setup/review')
  }

  const canSubmit = !loading && email && isValidEmail(email)

  return (
    <Paper className="mt-8 max-w-4xl mx-auto">
      <H2>Campaign Email Address</H2>
      <Body1 className="mb-8 mt-2">
        Your email address must be linked to your candidate website. For
        example: john@johnsmithformayor.com
      </Body1>
      <div className="max-w-xl">
        <EmailInput
          required
          fullWidth
          value={email}
          onChange={(e) => {
            handleEmailChange(e.target.value)
          }}
        />
      </div>

      <div className="mt-4 p-4 border rounded-md border-black/10">
        <div>
          <H4>How to create a Campaign Email Address:</H4>
          <Body2 className="mt-2">
            Here is a step by step guide for creating domain based emails::
          </Body2>
          <Body2>
            <ol className="mt-8 list-decimal list-inside">
              <li className="mb-8">
                Choose an email hosting provider. Here are some of our
                favorites:
                <ol className="mt-2 ml-4 list-alpha list-inside">
                  <li>Google Workspace</li>
                  <li>Microsoft 365</li>
                  <li>Zoho Mail</li>
                </ol>
              </li>

              <li className="mb-8">
                Set Up Your Email with Your Provider
                <ol className="mt-2 ml-4 list-decimal list-inside">
                  <li>Log in to your email hosting provider.</li>
                  <li>Add your domain</li>
                  <li>Verify your domain</li>
                </ol>
              </li>
              <li className="mb-8">
                Configure DNS Records
                <ol className="mt-2 ml-4 list-decimal list-inside">
                  <li>
                    Your email hosting provider will provide the necessary MX
                    records. Go to your domain registrar&apos;s DNS settings and
                    add the MX records provided by your email host.
                  </li>
                </ol>
              </li>
              <li>
                Create Your Email Address
                <ol className="mt-2 ml-4 list-decimal list-inside">
                  <li>
                    Log in to your email hosting dashboard. Navigate to the
                    section for managing email accounts. Create a new email
                    address, e.g., john@johnsmithforcouncil.org.
                  </li>
                </ol>
              </li>
            </ol>
          </Body2>
        </div>
      </div>
      <div className="mt-8 flex justify-between">
        <Link href="/dashboard/text-messaging/p2p-setup/website">
          <Button color="neutral" className="mr-4">
            Back
          </Button>
        </Link>
        <Button onClick={handleNext} disabled={!canSubmit} color="secondary">
          {loading ? 'Loading...' : 'Next'}
        </Button>
      </div>
    </Paper>
  )
}
