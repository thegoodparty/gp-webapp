import PortalPanel from '@shared/layouts/PortalPanel';
import OnboardingWrapper from '../../shared/OnboardingWrapper';

export default function GoalsPage(props) {
  return (
    <OnboardingWrapper {...props}>
      <PortalPanel color="#ea580c" smWhite>
        <h3 className="font-black text-xl italic mb-8">Step 2 coming</h3>
      </PortalPanel>
    </OnboardingWrapper>
  );
}
