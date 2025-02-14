import NotificationSection from './NotificationSection';
import PasswordSection from './PasswordSection';
import PersonalSection from './PersonalSection';
import { AccountSettingsSection } from 'app/(user)/profile/components/AccountSettingsSection';

export default function ProfilePage(props) {
  return (
    <div className="bg-indigo-100 min-h-[calc(100vh-60px)]">
      <div className="max-w-screen-md mx-auto px-4 pt-4 xl:p-0 xl:pt-4">
        <PersonalSection {...props} />
        <AccountSettingsSection {...props} />
        <NotificationSection />
        <PasswordSection {...props} />
      </div>
    </div>
  );
}
