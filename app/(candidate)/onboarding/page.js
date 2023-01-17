import OnboardingPage from './components/OnboardingPage';

export default async function Page() {
  const childProps = {
    title: 'Decide to Run',
    description:
      'Good Party  will be with you every step of the way so you can run a successful campaign.',
    self: '/onboarding',
  };
  return <OnboardingPage {...childProps} />;
}
