import { Suspense } from 'react';
import PortalWrapper from '../../shared/PortalWrapper';
import CampaignColorPicker from './CampaignColorPicker';

export default function EditCampaignPage(props) {
  return (
    <PortalWrapper {...props}>
      <Suspense fallback="loading">
        <CampaignColorPicker />
      </Suspense>
    </PortalWrapper>
  );
}
