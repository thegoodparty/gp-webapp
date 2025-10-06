'use client'
import H2 from '@shared/typography/H2'
import H5 from '@shared/typography/H5'
import Body2 from '@shared/typography/Body2'
import NewInfoAlert from '@shared/alerts/NewInfoAlert'
import TextingComplianceHeader from 'app/(user)/profile/texting-compliance/shared/TextingComplianceHeader'
import TextingComplianceRegistrationForm, {
  validateRegistrationForm,
} from './TextingComplianceRegistrationForm'
import { FormDataProvider } from '@shared/hooks/useFormData'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { useSnackbar } from 'helpers/useSnackbar'
import { mapFormData } from 'app/(user)/profile/texting-compliance/util/mapFormData.util'
import { trackEvent } from 'helpers/analyticsHelper'
import { EVENTS } from 'helpers/analyticsHelper'

const createTcrCompliance = async (formData) => {
  const mappedData = mapFormData(formData)
  const response = await clientFetch(apiRoutes.campaign.tcrCompliance.create, {
    ...mappedData,
  })
  if (!response.ok) {
    throw new Error('Failed to create TCR compliance')
  }

  return response.data
}

const reconcileInitialFormState = (user, campaign) => {
  const { email, phone } = user
  const { details: campaignDetails } = campaign
  const { einNumber: ein, campaignCommittee, website } = campaignDetails || {}

  return {
    electionFilingLink: '',
    campaignCommitteeName: campaignCommittee || '',
    localTribeName: '',
    ein: ein || '',
    phone: phone || '',
    address: { formatted_address: '' },
    placeId: '',
    website: website || '',
    email: email || '',
    matchingContactFields: [],
  }
}

export default function TextingComplianceRegisterPage({ user, campaign }) {
  const initialFormState = reconcileInitialFormState(user, campaign)
  const [loading, setLoading] = useState(false)
  const [hasSubmissionError, setHasSubmissionError] = useState(false)
  const { successSnackbar, errorSnackbar } = useSnackbar()
  const router = useRouter()

  const handleFormSubmit = async (formData) => {
    setLoading(true)
    try {
      await createTcrCompliance(formData)
      
      // Track 10 DLC compliance status change to Pending
      trackEvent(EVENTS.Outreach.DlcCompliance.RegistrationSubmitted, {
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

        <NewInfoAlert className="mb-6">
          <Body2>
            Try to match this information with your election filing when
            possible
          </Body2>
        </NewInfoAlert>

        <FormDataProvider
          initialState={initialFormState}
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
