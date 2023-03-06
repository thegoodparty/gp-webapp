import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getServerToken } from 'helpers/userServerHelper';
import OnboardingStartPage from './components/OnboardingStartPage';

export default async function Page() {
  const childProps = {
    title: "Hi! I'm Jared. Let's get your campaign started...",
    self: '/onboarding',
    slug: '',
  };
  return <OnboardingStartPage {...childProps} />;
}
