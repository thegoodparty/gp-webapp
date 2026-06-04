'use client'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { FormDataProvider, FormDataState } from '@shared/hooks/useFormData'
import { useUser } from '@shared/hooks/useUser'
import { useCampaign } from '@shared/hooks/useCampaign'
import { apiRoutes } from 'gpApi/routes'
import { useSnackbar } from 'helpers/useSnackbar'
import { TCR_COMPLIANCE_QUERY_KEY } from 'app/dashboard/profile/texting-compliance/util/tcrCompliance.util'
import {
  submitTcrCompliance,
  toRegistrationFormData,
} from 'app/dashboard/profile/texting-compliance/util/registrationFormData.util'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { USER_WEBSITE_QUERY_KEY } from 'app/dashboard/website/util/website.util'
import TextingComplianceRegistrationForm, {
  validateRegistrationForm,
} from 'app/dashboard/profile/texting-compliance/register/components/TextingComplianceRegistrationForm'

const validateAgenticForm = (data: FormDataState) =>
  validateRegistrationForm(data, { requireWebsite: false })

export default function ElectionFiling(): React.JSX.Element {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [user, , userLoading] = useUser()
  const [campaign] = useCampaign()
  const { errorSnackbar, successSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(false)
  const [hasSubmissionError, setHasSubmissionError] = useState(false)

  const ready = !userLoading && Boolean(user) && Boolean(campaign)

  // Funnel "viewed" event for the agentic compliance flow (ENG-10294). Fire
  // only once the form is actually shown — the form is gated behind `ready`, so
  // a bare mount event would count users who only see the Loading… spinner. The
  // matching "submitted" signal is the existing RegistrationSubmitted event in
  // handleFormSubmit.
  const filingViewTrackedRef = useRef(false)
  useEffect(() => {
    if (!ready || filingViewTrackedRef.current) return
    filingViewTrackedRef.current = true
    trackEvent(EVENTS.ProUpgrade.Compliance.FilingDetailsViewed)
  }, [ready])

  const handleFormSubmit = async (formData: FormDataState) => {
    setLoading(true)
    setHasSubmissionError(false)
    try {
      await submitTcrCompliance(
        apiRoutes.campaign.tcrCompliance.createAgentic,
        toRegistrationFormData(formData),
        'Failed to submit election filing',
      )
      trackEvent(EVENTS.Outreach.DlcCompliance.RegistrationSubmitted, {
        email: user?.email,
        dlcComplianceStatus: 'Pending',
      })
      successSnackbar('Election filing submitted')
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: USER_WEBSITE_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: TCR_COMPLIANCE_QUERY_KEY }),
      ])
      router.push('/dashboard/profile')
    } catch {
      setHasSubmissionError(true)
      errorSnackbar('Failed to submit election filing. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pt-2 md:pt-4">
      <div className="mx-auto w-full max-w-2xl p-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard/profile" aria-label="Back to profile">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <div className="font-medium md:text-xl">Election filing</div>
          <div>&nbsp;</div>
        </div>

        <div className="mt-10">
          {ready ? (
            <FormDataProvider
              initialState={getInitialFormState(campaign)}
              validator={validateAgenticForm}
            >
              <TextingComplianceRegistrationForm
                onSubmit={handleFormSubmit}
                loading={loading}
                hasSubmissionError={hasSubmissionError}
                requireWebsite={false}
              />
            </FormDataProvider>
          ) : (
            <div className="text-sm text-muted-foreground">Loading…</div>
          )}
        </div>
      </div>
    </div>
  )
}

// Email and phone are intentionally left blank rather than seeded from the
// candidate's GoodParty account (ENG-10290). Account contact info frequently
// does not match what is on the official campaign filing; pre-filling it led
// candidates to submit a mismatch without noticing, causing compliance
// failures. They must enter the email/phone exactly as filed. EIN and
// committee come from campaign.details, which reflect the filing, so those
// stay pre-filled.
export const getInitialFormState = (
  campaign: ReturnType<typeof useCampaign>[0],
): FormDataState => {
  const details = (campaign?.details ?? {}) as {
    einNumber?: string
    campaignCommittee?: string
  }
  return {
    electionFilingLink: '',
    campaignCommitteeName: details.campaignCommittee || '',
    officeLevel: '',
    ein: details.einNumber || '',
    phone: '',
    address: { formatted_address: '', place_id: '' },
    website: '',
    email: '',
  }
}
