import { useAdminCampaign } from '@shared/hooks/useAdminCampaign'
import { useState } from 'react'
import { updateCampaignAdminOnly } from 'app/admin/shared/updateCampaignAdminOnly'
import { P2VSection } from 'app/admin/victory-path/[slug]/components/P2VSection'
import Checkbox from '@shared/inputs/Checkbox'
import { CommitteeSupportingFilesUpload } from 'app/(candidate)/dashboard/pro-sign-up/committee-check/components/CommitteeSupportingFilesUpload'
import Link from 'next/link'
import { MdDelete, MdOpenInNew } from 'react-icons/md'
import SecondaryButton from '@shared/buttons/SecondaryButton'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'

const supportingDocsRootUrl =
  'https://ein-supporting-documents.s3.us-west-2.amazonaws.com/'

export const P2VProSection = () => {
  const [campaign = {}, _, refreshCampaign] = useAdminCampaign()
  const { slug = '', details = {} } = campaign
  const [isPro, setIsPro] = useState(campaign.isPro || false)

  const onChangeIsPro = async (e) => {
    const value = e.currentTarget.checked
    setIsPro(value)
    await updateCampaignAdminOnly({
      id: campaign.id,
      isPro: value,
    })
    await refreshCampaign()
  }

  const onDeleteSupportingDocument = async () => {
    await updateCampaign(
      [
        {
          key: 'details.einSupportingDocument',
          value: '',
        },
      ],
      slug,
    )
    await refreshCampaign()
  }

  return (
    <P2VSection title="Pro Plan Information">
      <div className="flex items-center mb-2">
        <Checkbox checked={isPro} disabled={isPro} onChange={onChangeIsPro} data-testid="is-pro-checkbox"/>
        <div className="ml-2">Is Pro</div>
      </div>
      <div className="mb-2">
        <span className="font-bold">Campaign Committee:</span>{' '}
        {details.campaignCommittee}
      </div>
      <div className="mb-2">
        <span className="font-bold">EIN:</span> {details.einNumber}
      </div>
      <div className="mb-2 flex items-center">
        {details.einSupportingDocument ? (
          <>
            <span className="font-bold mr-2">EIN Supporting Document:</span>{' '}
            <Link
              target="_blank"
              href={`${supportingDocsRootUrl}${details.einSupportingDocument}`}
            >
              View
              <MdOpenInNew className="ml-1 inline" />
            </Link>
            <SecondaryButton
              onClick={onDeleteSupportingDocument}
              size="small"
              className="ml-2"
            >
              Remove
              <MdDelete className="ml-1 inline" />
            </SecondaryButton>
          </>
        ) : (
          <CommitteeSupportingFilesUpload
            campaign={campaign}
            onUploadSuccess={refreshCampaign}
          />
        )}
      </div>
    </P2VSection>
  )
}
