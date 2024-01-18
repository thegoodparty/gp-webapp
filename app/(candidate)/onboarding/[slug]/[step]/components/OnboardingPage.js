import OnboardingLayout from 'app/(candidate)/onboarding/shared/OnboardingLayout';
import PhoneStep from './PhoneStep';
import RunForOfficeStep from './RunForOfficeStep';
import PartyStep from './PartyStep';

export default function OnboardingPage(props) {
  const { step } = props;
  return (
    <OnboardingLayout {...props}>
      <div className="max-w-screen-sm mx-auto px-4 xl:p-0">
        {step === 1 && <PhoneStep {...props} />}
        {step === 2 && <RunForOfficeStep {...props} />}
        {step === 3 && <PartyStep {...props} />}
      </div>
    </OnboardingLayout>
  );
}
