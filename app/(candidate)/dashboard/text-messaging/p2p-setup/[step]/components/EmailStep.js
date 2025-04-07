'use client'
import NeedHelpAnimation from '@shared/animations/NeedHelpAnimation'
import Button from '@shared/buttons/Button'
import { useCampaign } from '@shared/hooks/useCampaign'
import Body1 from '@shared/typography/Body1'
import H2 from '@shared/typography/H2'
import H3 from '@shared/typography/H3'
import Paper from '@shared/utils/Paper'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import EmailInput, { isValidEmail } from '@shared/inputs/EmailInput'
import { useUser } from '@shared/hooks/useUser'

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
    <>
      <Paper className="mt-8">
        <H2>Campaign Email Address</H2>
        <Body1 className="mb-8 mt-2">
          Campaign Email Address (Domain-Based, e.g.
          ,john@johnsmithforcouncil.org)
          <br />
          <br />
          <strong>Why:</strong> Needed to validate ownership of the candidate's
          website domain and receive the Campaign Verify PIN. Carriers require a
          domain-matching email for authenticity.
        </Body1>
        <div className="max-w-xl">
          <EmailInput
            required
            fullWidth
            value={email}
            onChange={(e) => {
              handleEmailChange(e.target.value)
            }}
            helperText="Please provide a valid email address"
          />
        </div>
        <div className="mt-2 flex justify-center">
          <Link href="/dashboard/text-messaging/p2p-setup/website">
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
            <H3>How to create a Campaign Email Address:</H3>
            <Body1 className="mt-2">
              Creating an email address like john@johnsmithforcouncil.org for
              your site involves setting up a custom email address using your
              domain name. Here's a step-by-step guide:
            </Body1>

            <ol className="mt-2 list-decimal list-inside">
              <li>
                <strong>Choose an Email Hosting Provider</strong>
                <ul>
                  <li>
                    Google Workspace (formerly G Suite): Paid service by Google
                    Provides Gmail with your custom domain (e.g.,
                    john@johnsmithforcouncil.org Google Workspace
                  </li>
                  <li>
                    Microsoft 365 (Outlook): Paid service by Microsoft Provides
                    Outlook with your custom domain Microsoft 365
                  </li>
                  <li>Zoho Mail: Free and paid options available Zoho Mail</li>
                  <li>
                    Your Hosting Provider: Many hosting providers (e.g.,
                    Bluehost, SiteGround, HostGator) include email hosting in
                    their plans.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Set Up Your Email with Your Provider</strong>
                <ul>
                  <li>Log in to your email hosting provider.</li>
                  <li>
                    Add your domain (johnsmithforcouncil.org) to the account.
                  </li>
                  <li>
                    Verify domain ownership: Your provider will give you a DNS
                    record to add to your domain registrar's DNS settings
                    (usually a TXT record). Go to your domain registrar, find
                    the DNS settings, and add the provided record.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Configure DNS Records</strong>
                <ul>
                  <li>
                    Your email hosting provider will provide the necessary MX
                    records. Go to your domain registrar's DNS settings and add
                    the MX records provided by your email host.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Create Your Email Address</strong>
                <ul>
                  <li>
                    Log in to your email hosting dashboard. Navigate to the
                    section for managing email accounts. Create a new email
                    address, e.g., john@johnsmithforcouncil.org.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Access Your Email</strong>
                <ul>
                  <li>
                    Use your provider's email client (e.g., Gmail, Outlook, Zoho
                    Mail). Alternatively, configure it in third-party email
                    clients like: Microsoft Outlook Apple Mail Thunderbird Use
                    the incoming and outgoing mail server settings provided by
                    your email host.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Test Your Email</strong>
                <ul>
                  <li>
                    Send and receive test emails to ensure everything is working
                    correctly. Double-check spam filters, forwarding rules, and
                    other settings.
                  </li>
                </ul>
              </li>
            </ol>
          </div>
          <div className="w-48 lg:w-96 relative">
            <NeedHelpAnimation />
          </div>
        </div>
      </Paper>
    </>
  )
}
