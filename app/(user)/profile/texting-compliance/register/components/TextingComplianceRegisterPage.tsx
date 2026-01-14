'use client'
import H2 from '@shared/typography/H2'
import H5 from '@shared/typography/H5'
import TextingComplianceHeader from 'app/(user)/profile/texting-compliance/shared/TextingComplianceHeader'
import TextingComplianceRegistrationForm, {
  validateRegistrationForm,
} from './TextingComplianceRegistrationForm'

// Form data type that matches what the form produces
interface RegistrationFormData {
  electionFilingLink: string
  campaignCommitteeName: string
  officeLevel: string
  ein: string
  phone: string
  address: { formatted_address: string; place_id?: string }
  placeId: string
  website: string
  email: string
}
import { FormDataProvider } from '@shared/hooks/useFormData'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { useSnackbar } from 'helpers/useSnackbar'
import { mapFormData } from 'app/(user)/profile/texting-compliance/util/mapFormData.util'
import { trackEvent } from 'helpers/analyticsHelper'
import { EVENTS } from 'helpers/analyticsHelper'
import { User, Campaign, Website } from 'helpers/types'

const createTcrCompliance = async (formData: RegistrationFormData) => {
  // @ts-ignore - formData shape matches what mapFormData expects at runtime
  const mappedData = mapFormData(formData)
  const response = await clientFetch(apiRoutes.campaign.tcrCompliance.create, {
    ...mappedData,
  })
  if (!response.ok) {
    throw new Error('Failed to create TCR compliance')
  }

  return response.data
}

interface WebsiteWithDomain {
  domain?: { name?: string } | null
  status?: string
  content?: Website['content']
}

const reconcileInitialFormState = (
  user: User,
  campaign: Campaign,
  website: WebsiteWithDomain | null | undefined,
): RegistrationFormData => {
  const { email, phone } = user
  const { details: campaignDetails } = campaign
  const { einNumber: ein, campaignCommittee } = campaignDetails || {}

  // Use the official purchased domain instead of manual input
  const officialDomain = website?.domain?.name || ''

  return {
    electionFilingLink: '',
    campaignCommitteeName: campaignCommittee || '',
    officeLevel: '',
    ein: ein || '',
    phone: phone || '',
    address: { formatted_address: '' },
    placeId: '',
    website: officialDomain ? `https://${officialDomain}` : '',
    email: email || '',
  }
}

interface TextingComplianceRegisterPageProps {
  user: User
  campaign: Campaign
  website: WebsiteWithDomain | null | undefined
}

export default function TextingComplianceRegisterPage({ user, campaign, website }: TextingComplianceRegisterPageProps): React.JSX.Element {
  const initialFormState = reconcileInitialFormState(user, campaign, website)
  const [loading, setLoading] = useState(false)
  const [hasSubmissionError, setHasSubmissionError] = useState(false)
  const { successSnackbar, errorSnackbar } = useSnackbar()
  const router = useRouter()

  const handleFormSubmit = async (formData: RegistrationFormData) => {
    setLoading(true)
    try {
      await createTcrCompliance(formData)

      // Track 10 DLC compliance status change to Pending
      trackEvent(EVENTS.Outreach.DlcCompliance.RegistrationSubmitted, {
        email: user.email,
        dlcComplianceStatus: 'Pending',
      })

      successSnackbar('Successfully registered for compliance')
      router.push('/profile')
    } catch {
      setHasSubmissionError(true)
      errorSnackbar(
        'Failed to register for compliance. Please try again later.',
      )
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-white pt-2 md:pb-20 md:pt-0 md:min-h-0">
      <TextingComplianceHeader>
        <H5 className="flex-1 text-center md:hidden">Register your campaign</H5>
      </TextingComplianceHeader>

      <div className="mx-auto max-w-2xl px-4 py-6 md:px-8 md:py-8">
        <H2 className="mb-6 hidden md:block">Register your campaign</H2>

        <FormDataProvider
          initialState={initialFormState}
          // @ts-ignore - JS validator returns different shape than expected
          validator={validateRegistrationForm}
        >
          <TextingComplianceRegistrationForm
            {...{
              onSubmit: handleFormSubmit,
              loading,
              hasSubmissionError,
            }}
          />
        </FormDataProvider>
      </div>
    </div>
  )
}
