import { getServerUser } from 'helpers/userServerHelper';
import ClientRegisterOrProfile from './ClientRegisterOrProfile';

export default function RegisterOrProfile() {
  const user = getServerUser();
  return <ClientRegisterOrProfile user={user} />;
}
