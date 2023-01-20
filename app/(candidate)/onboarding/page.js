import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getServerToken } from 'helpers/userServerHelper';
import OnboardingPage from './components/OnboardingPage';

const fetchPositions = async () => {
  const api = gpApi.admin.position.list;
  const token = getServerToken();
  return await gpFetch(api, false, 3600, token);
};

export default async function Page() {
  const { positions } = await fetchPositions();
  const childProps = {
    title: 'Decide to Run',
    description:
      'Good Party  will be with you every step of the way so you can run a successful campaign.',
    self: '/onboarding',
    positions,
    slug: '',
  };
  return <OnboardingPage {...childProps} />;
}
