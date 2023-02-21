import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getServerToken } from 'helpers/userServerHelper';
import OnboardingPage from './components/OnboardingPage';

export default async function Page() {
  const childProps = {
    title:
      "Hi! I'm Jared. I just need a little bit of information so we can help you get started...",
    description:
      'Good Party  will be with you every step of the way so you can run a successful campaign.',
    self: '/onboarding',
    slug: '',
  };
  return <OnboardingPage {...childProps} />;
}
