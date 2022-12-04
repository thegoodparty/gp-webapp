import PortalWrapper from '../shared/PortalWrapper';
import CampaignPanel from './CampaignPanel';
import VoterProjection from './VoterProjection';

export default function PortalHomePage(props) {
  return (
    <PortalWrapper {...props}>
      <CampaignPanel {...props} />
      <VoterProjection {...props} />
    </PortalWrapper>
  );
}
