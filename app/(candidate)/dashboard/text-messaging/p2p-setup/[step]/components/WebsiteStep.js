'use client'
import Button from '@shared/buttons/Button'
import { useCampaign } from '@shared/hooks/useCampaign'
import H2 from '@shared/typography/H2'
import Paper from '@shared/utils/Paper'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TextField from '@shared/inputs/TextField'
import { isValidUrl } from 'helpers/linkhelper'
import Body2 from '@shared/typography/Body2'
import H4 from '@shared/typography/H4'
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
      <Paper className="mt-8 max-w-4xl mx-auto">
        <H2>Compliant Candidate Website</H2>
        <Body2 className="mb-8 mt-2">
          Your website must be active and include opt-in forms with SMS
          disclaimers, optional phone number fields, and a linked privacy
          policy.
          <br />
          Your website must comply with the 10DLC messaging rules.
        </Body2>
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
        <div className="mt-4 p-4 border rounded-md border-black/10">
          <H4>Compliance Checklist</H4>
          <Body2>Your website must:</Body2>
          <Body2>
            <ol className="mt-4 list-decimal list-inside">
              <li className="mb-2">
                Represents your political or nonprofit brand authentically
              </li>
              <li className="mb-2">
                Allow users to provide their phone number to recieve updates
              </li>
              <li className="mb-2">Have an optional phone number field</li>
              <li className="mb-2">Include an SMS disclaimer on every form</li>
              <li className="mb-2">
                Have a link to a privacy policy that explicitly states how text
                opt-in data is handled
              </li>
            </ol>
          </Body2>
        </div>
        <div className="mt-4 p-4 border rounded-md border-black/10">
          <H4>Required SMS Disclaimer for Opt-In Forms</H4>
          <Body2>
            Use the following SMS opt-in disclaimer on every form you use that
            collect phone numbers:{' '}
          </Body2>
          <Body2>
            <i>
              By providing your phone number and checking the box, you consent
              to receive text message updates. Msg & data rates may apply. Msg
              frequency may vary. Messaging may include donation requests. Reply
              “STOP” to opt-out & “HELP” for help. [Link to Privacy Policy]
            </i>
            <br />
            <br />
            <strong>Checkbox Requirement:</strong> I consent to receive text
            updates.
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
          </Body2>
        </div>
        <div className="mt-8 flex justify-between">
          <Link href="/dashboard/text-messaging/p2p-setup/ein">
            <Button color="neutral" className="mr-4">
              Back
            </Button>
          </Link>
          <Button onClick={handleNext} disabled={!canSubmit} color="secondary">
            {loading ? 'Loading...' : 'Next'}
          </Button>
        </div>
      </Paper>
    </>
  )
}
