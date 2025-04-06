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
import TextField from '@shared/inputs/TextField'
import { isValidUrl } from 'helpers/linkhelper'
export default function WebsiteStep() {
  const [campaign] = useCampaign()
  const [website, setWebsite] = useState(campaign?.details?.website)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setWebsite(campaign?.details?.website)
  }, [campaign])

  const handleWebsiteChange = (value) => {
    setWebsite(value)
  }

  const handleNext = async () => {
    setLoading(true)
    await updateCampaign([
      {
        key: 'details.website',
        value: website,
      },
    ])
    router.push('/dashboard/text-messaging/p2p-setup/email')
  }

  const canSubmit = !loading && website && isValidUrl(website)

  return (
    <>
      <Paper className="mt-8">
        <H2>Compliant Candidate Website</H2>
        <Body1 className="mb-8 mt-2">
          live website that includes opt-in forms with SMS disclaimers, optional
          phone number fields, and a linked privacy policy. This page must
          represent the candidate and comply with 10DLC messaging rules.
        </Body1>
        <div className="max-w-xl">
          <TextField
            required
            label="Website"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={website}
            onChange={(e) => {
              handleWebsiteChange(e.target.value)
            }}
            helperText="Please provide a full url starting with http"
          />
        </div>
        <div className="mt-2 flex justify-center">
          <Link href="/dashboard/text-messaging/p2p-setup/ein">
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
            <H3>Compliant Website Checklist:</H3>
            <ol className="mt-2 list-decimal list-inside">
              <li>
                The website represents your{' '}
                <strong>political or nonprofit brand</strong> authentically
                authentically
              </li>
              <li>
                <strong>All forms must allow users to </strong>provide their
                phone number to receive updates
              </li>
              <li>
                The <strong>phone number field must be optional</strong> (not
                mandatory)
              </li>
              <li>
                Any form <strong>must include an SMS disclaimer</strong>{' '}
                (consent, frequency, opt-out info)
              </li>
              <li>
                Disclaimer <strong>must link to a Privacy Policy</strong> that
                <strong>
                  {' '}
                  explicitly states how text opt-in data is handled
                </strong>
              </li>
            </ol>
            <Body1 className="mt-4">
              Privacy Policy with Compliant Language:{' '}
              <a
                href="https://go.rc-link.info/sample-privacy-policy"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                View Here
              </a>
            </Body1>
            <Body1 className="mt-2">
              Example of a Compliant Website:{' '}
              <a
                href="https://sample10dlc.com/"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                https://sample10dlc.com/
              </a>
            </Body1>
            <Body1 className="mt-2">
              Get a compliant website in 24 hours for $500:{' '}
              <a
                href="https://sample10dlc.com/"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Request New Build
              </a>
            </Body1>
            <H3 className="mb-2 mt-8">
              Required SMS Disclaimer for Opt-In Forms
            </H3>
            <Body1 className="mt-2">
              Your website must include the following SMS opt-in disclaimer on
              every form that collects phone numbers.
              <br />
              <br />
              <i>
                By providing your phone number and checking the box, you consent
                to receive text message updates. Msg & data rates may apply. Msg
                frequency may vary. Messaging may include donation requests.
                Reply “STOP” to opt-out & “HELP” for help. [Link to Privacy
                Policy]
              </i>
              <br />
              <br />
              <strong>Checkbox Requirement:</strong> I consent to receive text
              updates.
              <br />
              <br />
              <br />
              And the below language in your Privacy Policy:
              <br />
              <br />
              <i>
                <strong>Text Message Opt-In Information:</strong> We will not
                share or sell your text messaging opt-in data, consent, or
                associated personal information with any third parties, unless
                mandated by law.
              </i>
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
