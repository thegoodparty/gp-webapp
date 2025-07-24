'use client'
import H2 from '@shared/typography/H2'
import H5 from '@shared/typography/H5'
import Body2 from '@shared/typography/Body2'
import NewInfoAlert from '@shared/alerts/NewInfoAlert'
import TextingComplianceHeader from 'app/(user)/profile/texting-compliance/shared/TextingComplianceHeader'
import TextingComplianceRegistrationForm, {
  validateRegistrationForm,
} from './TextingComplianceRegistrationForm'
// <<<<<<< HEAD
import { FormDataProvider } from '@shared/hooks/useFormData'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { useSnackbar } from 'helpers/useSnackbar'
import { mapFormData } from 'app/(user)/profile/texting-compliance/util/mapFormData.util'

// TODO: This is temporary initial form state data for UI development.
const mockInitialFormState = {
  // =======
  // import TextingComplianceFooter from 'app/(user)/profile/texting-compliance/shared/TextingComplianceFooter'
  // import { FormDataProvider } from '@shared/hooks/useFormData'

  // TODO: This is temporary initial form state data for UI development.
  // const initialFormState = {
  // >>>>>>> origin/develop
  electionFilingLink: 'https://elections.example.com/filing123',
  campaignCommitteeName: 'Friends of Democracy',
  localTribeName: 'Cherokee Nation',
  ein: '12-3456789',
  phone: '(805) 550-3465',
  // <<<<<<< HEAD
  website: 'https://friendsofdemocracy.org',
  email: 'contact@friendsofdemocracy.org',
  verifyInfo: false,
}

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
    website: website || '',
    email: email || '',
    verifyInfo: false,
    ...mockInitialFormState,
  }
}

export default function TextingComplianceRegisterPage({ user, campaign }) {
  const initialFormState = reconcileInitialFormState(user, campaign)
  const [loading, setLoading] = useState(false)
  const { successSnackbar, errorSnackbar } = useSnackbar()
  const router = useRouter()

  const handleFormSubmit = async (formData) => {
    console.log('Form submitted with data:', formData)
    setLoading(true)
    try {
      await createTcrCompliance(formData)
      successSnackbar('Successfully registered for compliance')
      router.push('/profile')
    } catch {
      errorSnackbar(
        'Failed to register for compliance. Please try again later.',
      )
    } finally {
      setLoading(false)
    }
  }
  // =======
  //   address: { formatted_address: '123 Main St, Springfield, IL 62701' },
  //   website: 'https://friendsofdemocracy.org',
  //   email: 'contact@friendsofdemocracy.org',
  //   verifyInfo: false,
  // }
  //
  // export default function TextingComplianceRegisterPage() {
  // >>>>>>> origin/develop
  return (
    <div className="min-h-screen bg-white pt-2 md:pb-20 md:pt-0 md:min-h-0">
      <TextingComplianceHeader>
        <H5 className="flex-1 text-center md:hidden">Register</H5>
      </TextingComplianceHeader>

      <div className="mx-auto max-w-2xl px-4 py-6 md:px-8 md:py-8">
        <H2 className="mb-6 hidden md:block">Register your campaign</H2>

        <NewInfoAlert className="mb-6">
          <Body2>This information must match your election filings</Body2>
        </NewInfoAlert>

        <FormDataProvider
          initialState={initialFormState}
          validator={validateRegistrationForm}
        >
          {/*<<<<<<< HEAD*/}
          <TextingComplianceRegistrationForm
            {...{
              onSubmit: handleFormSubmit,
              loading,
            }}
          />
          {/*=======*/}
          {/*          <TextingComplianceRegistrationForm />*/}
          {/*<TextingComplianceFooter />*/}
          {/*>>>>>>> origin/develop*/}
        </FormDataProvider>
      </div>
    </div>
  )
}
