import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import ApplicationSection from './components/ApplicationSection';
import CampaignStaff from './components/CampaignStaff';

export default function Page() {
  const user = getServerUser();
  if (!user) {
    redirect('/');
  }
  return (
    <>
      <CampaignStaff />
      <ApplicationSection />
    </>
  );
}
