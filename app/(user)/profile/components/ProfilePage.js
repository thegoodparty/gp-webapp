import NotificationSection from './NotificationSection';
import HeaderSection from './HeaderSection';
import PasswordSection from './PasswordSection';
import PersonalSection from './PersonalSection';
import DeleteSection from './DeleteSection';
import InvitationSection from './InvitationSection';

export default function ProfilePage(props) {
  return (
    <div className="bg-slate-50 py-6">
      <div className="max-w-4xl mx-auto bg-gray-50 py-5 px-6 rounded-xl">
        <HeaderSection />
        <InvitationSection {...props} />
        <PersonalSection />
        <PasswordSection />
        <NotificationSection />
        <DeleteSection />
      </div>
    </div>
  );
}
