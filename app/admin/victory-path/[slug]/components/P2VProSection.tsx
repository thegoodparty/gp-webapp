import { useAdminCampaign } from '@shared/hooks/useAdminCampaign'
import { useState, ChangeEvent } from 'react'
import { updateCampaignAdminOnly } from 'app/admin/shared/updateCampaignAdminOnly'
import { P2VSection } from 'app/admin/victory-path/[slug]/components/P2VSection'
import Checkbox from '@shared/inputs/Checkbox'
import { CommitteeSupportingFilesUpload } from 'app/(candidate)/dashboard/pro-sign-up/committee-check/components/CommitteeSupportingFilesUpload'
import { MdDelete, MdOpenInNew } from 'react-icons/md'
import SecondaryButton from '@shared/buttons/SecondaryButton'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export const P2VProSection = (): React.JSX.Element => {
  const [campaign, _, refreshCampaign] = useAdminCampaign()
  const { slug = '', details } = campaign || {}
  const [isPro, setIsPro] = useState(campaign?.isPro || false)
  const [isLoadingDocument, setIsLoadingDocument] = useState(false)

  const onChangeIsPro = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const value = e.currentTarget.checked
    setIsPro(value)
    await updateCampaignAdminOnly({
      id: campaign?.id || 0,
      isPro: value,
    })
    await refreshCampaign()
  }

  const onDeleteSupportingDocument = async (): Promise<void> => {
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

  const onViewDocument = async (): Promise<void> => {
    if (!slug || isLoadingDocument) return
    setIsLoadingDocument(true)
    try {
      const resp = await clientFetch<{ signedUrl: string }>(
        apiRoutes.campaign.einDocumentUrl,
        { slug },
      )
      if (resp.ok && resp.data?.signedUrl) {
        window.open(resp.data.signedUrl, '_blank')
      }
    } catch (e) {
      console.error('Error fetching document URL', e)
    } finally {
      setIsLoadingDocument(false)
    }
  }

  return (
    <P2VSection title="Pro Plan Information">
      <div className="flex items-center mb-2">
        <Checkbox
          checked={isPro}
          disabled={isPro}
          onChange={onChangeIsPro}
          data-testid="is-pro-checkbox"
        />
        <div className="ml-2">Is Pro</div>
      </div>
      <div className="mb-2">
        <span className="font-bold">Campaign Committee:</span>{' '}
        {details?.campaignCommittee}
      </div>
      <div className="mb-2">
        <span className="font-bold">EIN:</span> {details?.einNumber}
      </div>
      <div className="mb-2 flex items-center">
        {details?.einSupportingDocument ? (
          <>
            <span className="font-bold mr-2">EIN Supporting Document:</span>{' '}
            <button
              onClick={onViewDocument}
              disabled={isLoadingDocument}
              className="text-blue-600 hover:text-blue-800 underline inline-flex items-center disabled:opacity-50"
            >
              {isLoadingDocument ? 'Loading...' : 'View'}
              <MdOpenInNew className="ml-1 inline" />
            </button>
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
            campaign={campaign ? { id: campaign.id, slug: campaign.slug } : undefined}
            onUploadSuccess={refreshCampaign}
          />
        )}
      </div>
    </P2VSection>
  )
}
