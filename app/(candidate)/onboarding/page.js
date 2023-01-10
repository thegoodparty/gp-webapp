import OnboardingPage from './components/OnboardingPage';

export default async function Page() {
  const childProps = {
    title: 'Onboarding Playground',
  };
  return <OnboardingPage {...childProps} />;
}
