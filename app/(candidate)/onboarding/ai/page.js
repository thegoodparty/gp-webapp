import OnboardingPage from './components/AiPage';

export default async function Page() {
  const childProps = {
    title: 'Onboarding Playground',
  };
  return <OnboardingPage {...childProps} />;
}
