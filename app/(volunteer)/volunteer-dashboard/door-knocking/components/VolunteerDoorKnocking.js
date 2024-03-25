import VolunteerDashboardLayout from '../../shared/VolunteerDashboardLayout';

import DesktopQr from './DesktopQr';
import VolunteerRoutes from './VolunteerRoutes';

export default function VolunteerDoorKnocking(props) {
  return (
    <VolunteerDashboardLayout {...props}>
      <div className="p-2">
        <DesktopQr />
        <VolunteerRoutes {...props} />
      </div>
    </VolunteerDashboardLayout>
  );
}
