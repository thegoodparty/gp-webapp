'use client'
import H2 from '@shared/typography/H2'
import H5 from '@shared/typography/H5'
import Body2 from '@shared/typography/Body2'
import NewInfoAlert from '@shared/alerts/NewInfoAlert'
import TextingComplianceHeader from 'app/(user)/profile/texting-compliance/shared/TextingComplianceHeader'
import TextingComplianceRegistrationForm, {
  validateRegistrationForm,
} from './TextingComplianceRegistrationForm'
import TextingComplianceFooter from 'app/(user)/profile/texting-compliance/shared/TextingComplianceFooter'
import { FormDataProvider } from '@shared/hooks/useFormData'

const initialFormState = {
  electionFilingLink: 'https://elections.example.com/filing123',
  campaignCommitteeName: 'Friends of Democracy',
  localTribeName: 'Cherokee Nation',
  ein: '12-3456789',
  phone: '(805) 550-3465',
  address: '123 Main St, Springfield, IL 62701',
  website: 'https://friendsofdemocracy.org',
  email: 'contact@friendsofdemocracy.org',
  verifyInfo: false,
}

export default function TextingComplianceRegisterPage() {
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
          <TextingComplianceRegistrationForm />
          <TextingComplianceFooter />
        </FormDataProvider>
      </div>
    </div>
  )
}
