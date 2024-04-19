import VolunteerDashboardLayout from '../../shared/VolunteerDashboardLayout';

import DesktopQr from './DesktopQr';
import MobileOnlyWrapper from './MobileOnlyWrapper';
import VolunteerRoutes from './VolunteerRoutes';

export default function VolunteerDoorKnocking(props) {
  return (
    <VolunteerDashboardLayout {...props}>
      <MobileOnlyWrapper>
        <VolunteerRoutes {...props} />
      </MobileOnlyWrapper>
    </VolunteerDashboardLayout>
  );
}
