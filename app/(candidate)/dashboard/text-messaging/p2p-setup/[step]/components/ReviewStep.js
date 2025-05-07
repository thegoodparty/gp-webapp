'use client'
import Button from '@shared/buttons/Button'
import Body1 from '@shared/typography/Body1'
import Body2 from '@shared/typography/Body2'
import H2 from '@shared/typography/H2'
import Overline from '@shared/typography/Overline'
import Paper from '@shared/utils/Paper'
import { AlertBanner } from 'app/(candidate)/dashboard/components/AlertBanner'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useComplianceForm } from './ComplianceFormContext'
import { useSnackbar } from 'helpers/useSnackbar'

/**
 * Submits compliance information for text messaging campaign
 * @param {Object} body - The compliance information
 * @param {string} body.ein - Employer Identification Number
 * @param {string} body.name - Org name associated with EIN
 * @param {string} body.address - Address associated with EIN
 * @param {string} body.website - 10DLC compliant website
 * @param {string} body.email - 10DLC compliant email
 */
function submitCompliance(body) {
  return clientFetch(apiRoutes.textMessaging.submitCompliance, {
    ...body,
  })
}

export default function ReviewStep() {
  const router = useRouter()
  const [complianceForm] = useComplianceForm()
  const { errorSnackbar, successSnackbar } = useSnackbar()

  const website = complianceForm?.website
  const campaignEmail = complianceForm?.email
  const einNumber = complianceForm?.ein

  const handleNext = async () => {
    console.log('COMPLIANCE FORM', complianceForm)
    const resp = await submitCompliance(complianceForm)

    if (resp.ok) {
      successSnackbar('Compliance information submitted successfully.')
      router.push('/dashboard/text-messaging')
    } else {
      errorSnackbar(
        'Error submitting compliance information. Please try again later.',
      )
    }
  }

  return (
    <Paper className="mt-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <H2>Confirm Information</H2>
        <Body1 className="mb-8 mt-2">
          Please confirm the following information for your compliance review:
        </Body1>
        <Overline className="mb-1">EIN</Overline>
        <Body2>{einNumber}</Body2>
        <Overline className="mb-1 mt-4">Website</Overline>
        <Body2>{website}</Body2>
        <Overline className="mb-1 mt-4">Campaign Email</Overline>
        <Body2>{campaignEmail}</Body2>
      </div>
      <AlertBanner
        message="By clicking Finish you certify all information is correct and&hellip; Once approved we will work with the mobile carrier to get your text messaging campaign live. This can take up to 10 business days."
        type="info"
      />
      <div className="mt-8 flex justify-between">
        <Link href="/dashboard/text-messaging/p2p-setup/email">
          <Button color="neutral" className="mr-4">
            Back
          </Button>
        </Link>
        <Button onClick={handleNext} color="secondary">
          Finish
        </Button>
      </div>
    </Paper>
  )
}
