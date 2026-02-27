'use client'
import H2 from '@shared/typography/H2'
import H5 from '@shared/typography/H5'
import TextingComplianceHeader from 'app/(user)/profile/texting-compliance/shared/TextingComplianceHeader'
import { FormDataProvider } from '@shared/hooks/useFormData'
import {
  TextingComplianceSubmitPinForm,
  validatePinForm,
  PinFormData,
} from 'app/(user)/profile/texting-compliance/submit-pin/components/TextingComplianceSubmitPinForm'
import { useRouter } from 'next/navigation'
import { useSnackbar } from 'helpers/useSnackbar'
import { useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { trackEvent } from 'helpers/analyticsHelper'
import { EVENTS } from 'helpers/analyticsHelper'
import { useUser } from '@shared/hooks/useUser'

interface TcrCompliance {
  id: number
}

interface TextingComplianceSubmitPinPageProps {
  tcrCompliance: TcrCompliance
}

const initialFormState: PinFormData = {
  pin: '',
}

const submitCvPin = async (tcrComplianceId: number, formData: PinFormData) => {
  const response = await clientFetch(
    apiRoutes.campaign.tcrCompliance.submitCvPin,
    { ...formData, tcrComplianceId },
  )

  if (!response.ok) {
    throw new Error('Failed to submit PIN')
  }

  return response.data
}

const TextingComplianceSubmitPinPage = ({
  tcrCompliance,
}: TextingComplianceSubmitPinPageProps): React.JSX.Element => {
  const [loading, setLoading] = useState(false)
  const { successSnackbar, errorSnackbar } = useSnackbar()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [user] = useUser()

  const handleFormSubmit = async (formData: PinFormData) => {
    setLoading(true)
    try {
      await submitCvPin(tcrCompliance.id, formData)

      // Track 10 DLC compliance status change to Yes
      trackEvent(EVENTS.Outreach.DlcCompliance.PinVerificationCompleted, {
        email: user?.email,
        dlcComplianceStatus: 'Yes',
      })

      successSnackbar('Successfully submitted Campaign Verify PIN')
      router.push('/profile')
    } catch {
      errorSnackbar(
        'Failed to submit Campaign Verify PIN. Please try again later.',
      )
      setError('Failed to verify PIN')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white pt-2 md:pt-0">
      <TextingComplianceHeader>
        <H5 className="flex-1 text-center md:hidden">Enter your PIN</H5>
      </TextingComplianceHeader>

      <div className="mx-auto max-w-2xl px-4 py-6 md:px-8 md:py-8">
        <H2 className="mb-6 hidden md:block">Enter your PIN</H2>

        <FormDataProvider
          initialState={initialFormState}
          validator={validatePinForm}
        >
          <TextingComplianceSubmitPinForm
            {...{
              onSubmit: handleFormSubmit,
              loading,
              error,
            }}
          />
        </FormDataProvider>
      </div>
    </div>
  )
}

export default TextingComplianceSubmitPinPage
