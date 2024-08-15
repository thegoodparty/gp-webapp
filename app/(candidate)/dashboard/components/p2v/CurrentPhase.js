import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import Body2 from '@shared/typography/Body2';
import H2 from '@shared/typography/H2';
import H4 from '@shared/typography/H4';
import { BsFillPersonCheckFill } from 'react-icons/bs';

export function CurrentPhase(props) {
  const phaseName = 'Contact';
  const phaseDesc =
    'During this voter contact phase your main objective is to target voters who are likely to be swayed by you campaign messaging.';
  return (
    <div className="hidden md:flex justify-between bg-primary-background mt-4 p-4 rounded-lg border border-primary">
      <div className="flex">
        <BsFillPersonCheckFill size={20} className="mt-1" />
        <div className="ml-4">
          <H4>
            Current Phase: <strong>{phaseName}</strong>
          </H4>
          <Body2>{phaseDesc}</Body2>
        </div>
      </div>
      <div>
        <PrimaryButton variant="text" size="medium">
          Learn More
        </PrimaryButton>
      </div>
    </div>
  );
}
