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
    title:
      "Hi! I'm Jared. I just need a little bit of information so we can help you get started...",
    description:
      'Good Party  will be with you every step of the way so you can run a successful campaign.',
    self: '/onboarding',
    positions,
    slug: '',
  };
  return <OnboardingPage {...childProps} />;
}
