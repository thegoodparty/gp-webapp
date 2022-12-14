import ImageSection from './components/ImageSection';
import PersonalSection from './components/PersonalSection';
import PasswordSection from './components/PasswordSection';
import DeleteSection from './components/DeleteSection';
import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';

export default function Page() {
  const user = getServerUser();
  if (!user) {
    redirect('/login');
  }
  return (
    <>
      <ImageSection />
      <PersonalSection />
      <PasswordSection />
      <DeleteSection />
    </>
  );
}
