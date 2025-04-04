import Modal from '@shared/utils/Modal'
import OfficeStep from 'app/(candidate)/onboarding/[slug]/[step]/components/OfficeStep'

export const CampaignOfficeSelectionModal = ({
  campaign = { details: {} },
  show = false,
  onClose = () => {},
  onSelect = () => {},
  adminMode = false,
}) => (
  <Modal
    open={show}
    closeCallback={onClose}
    boxClassName="w-[95vw] lg:w-[60vw]"
  >
    <OfficeStep
      campaign={campaign}
      updateCallback={onSelect}
      adminMode={adminMode}
    />
  </Modal>
)
