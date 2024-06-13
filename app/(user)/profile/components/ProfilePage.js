import NotificationSection from './NotificationSection';
import HeaderSection from './HeaderSection';
import PasswordSection from './PasswordSection';
import PersonalSection from './PersonalSection';
import DeleteSection from './DeleteSection';
import InvitationSection from './InvitationSection';
import FullStoryScript from '@shared/scripts/FullStoryScript';
import { AccountSettingsSection } from 'app/(user)/profile/components/AccountSettingsSection';

export default function ProfilePage(props) {
  return (
    <div className="bg-indigo-50 py-6">
      <FullStoryScript />
      <div className="max-w-4xl mx-auto bg-gray-50 py-5 px-6 rounded-xl">
        <HeaderSection />
        <InvitationSection {...props} />
        <PersonalSection />
        <AccountSettingsSection {...props} />
        <PasswordSection />
        <NotificationSection />
        <DeleteSection />
      </div>
    </div>
  );
}
