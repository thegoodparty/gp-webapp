import NotificationSection from './NotificationSection';
import HeaderSection from './HeaderSection';
import PasswordSection from './PasswordSection';
import PersonalSection from './PersonalSection';
import DeleteSection from './DeleteSection';
import InvitationSection from './InvitationSection';
import { AccountSettingsSection } from 'app/(user)/profile/components/AccountSettingsSection';
import CardPageWrapper from '@shared/cards/CardPageWrapper';
import MaxWidth from '@shared/layouts/MaxWidth';
import Paper from '@shared/utils/Paper';

export default function ProfilePage(props) {
  return (
    <div className="bg-indigo-100 min-h-[calc(100vh-60px)]">
      <div className="max-w-screen-md mx-auto px-4 pt-4 xl:p-0 xl:pt-4">
        <Paper>
          <HeaderSection />
        </Paper>

        <InvitationSection {...props} />

        <PersonalSection {...props} />
        <AccountSettingsSection {...props} />
        <PasswordSection {...props} />
        <NotificationSection />
        <DeleteSection />
      </div>
    </div>
  );
}
