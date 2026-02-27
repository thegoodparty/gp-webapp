import Modal from '@shared/utils/Modal'
import OfficeStep from 'app/(candidate)/onboarding/[slug]/[step]/components/OfficeStep'
import { Campaign, CampaignDetails } from 'helpers/types'

interface PartialCampaign {
  id?: string | number
  slug?: string
  userId?: string
  details?: Partial<CampaignDetails>
}

function isFullCampaign(
  campaign: Campaign | PartialCampaign,
): campaign is Campaign {
  return (
    'createdAt' in campaign &&
    'updatedAt' in campaign &&
    'details' in campaign &&
    campaign.details !== undefined
  )
}

interface CampaignOfficeSelectionModalProps {
  campaign?: Campaign | PartialCampaign
  show?: boolean
  onClose?: () => void
  onSelect?: () => void
  adminMode?: boolean
}

export const CampaignOfficeSelectionModal = ({
  campaign,
  show = false,
  onClose = () => {},
  onSelect = () => {},
  adminMode = false,
}: CampaignOfficeSelectionModalProps): React.JSX.Element => (
  <Modal
    open={show}
    closeCallback={onClose}
    boxClassName="w-[95vw] lg:w-[60vw]"
  >
    {campaign && isFullCampaign(campaign) ? (
      <OfficeStep
        campaign={campaign}
        step={undefined}
        updateCallback={onSelect}
        adminMode={adminMode}
      />
    ) : (
      <div className="p-4 text-center">
        <p>Loading campaign details...</p>
      </div>
    )}
  </Modal>
)
