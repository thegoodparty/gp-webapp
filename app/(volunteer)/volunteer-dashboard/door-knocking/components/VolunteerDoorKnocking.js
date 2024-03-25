import VolunteerDashboardLayout from '../../shared/VolunteerDashboardLayout';

import DesktopQr from './DesktopQr';
import VolunteerRoutes from './VolunteerRoutes';

export default function VolunteerDoorKnocking(props) {
  return (
    <VolunteerDashboardLayout {...props}>
      <DesktopQr />
      <VolunteerRoutes {...props} />
    </VolunteerDashboardLayout>
  );
}
