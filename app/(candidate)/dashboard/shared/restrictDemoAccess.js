import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';

export const restrictDemoAccess = () => {
  const user = getServerUser();
  const { metaData } = user || {};
  const { demoPersona } = JSON.parse(metaData || '{}');

  if (demoPersona) {
    redirect('/dashboard');
  }
};
