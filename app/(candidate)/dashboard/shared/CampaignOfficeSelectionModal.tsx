import Modal from '@shared/utils/Modal'
import OfficeStep from 'app/(candidate)/onboarding/[slug]/[step]/components/OfficeStep'
import { Campaign, CampaignDetails } from 'helpers/types'

interface MinimalCampaign {
  id?: number | string
  slug?: string
  details?: Partial<CampaignDetails>
}

interface CampaignOfficeSelectionModalProps {
  campaign?: Campaign | MinimalCampaign
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
    <OfficeStep
      campaign={campaign}
      step={undefined}
      updateCallback={onSelect}
      adminMode={adminMode}
    />
  </Modal>
)
