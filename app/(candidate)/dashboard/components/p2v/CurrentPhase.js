import Body2 from '@shared/typography/Body2';
import H4 from '@shared/typography/H4';
import { BsFillPersonCheckFill } from 'react-icons/bs';
import { phases, PhasesModal } from './PhasesModal';
import { daysTill } from 'helpers/dateHelper';

import { memo } from 'react';

export const CurrentPhase = memo(function CurrentPhase({ campaign }) {
  const { details } = campaign;
  const { electionDate } = details || {};
  if (!electionDate) {
    return <div className="h-4" />;
  }

  const daysUntilElection = daysTill(electionDate);
  if (daysUntilElection < 0) {
    return <div className="h-4" />;
  }

  let phaseName = 'Contact';
  let phaseDesc =
    'During this voter contact phase your main objective is to target voters who are likely to be swayed by you campaign messaging.';
  if (daysUntilElection < 6 * 7) {
    phaseName = phases[2].title;
    phaseDesc = `During this voter contact phase your main objective is to ${
      phases[2].objective.charAt(0).toLowerCase() + phases[2].objective.slice(1)
    }`;
  } else if (daysUntilElection < 6 * 4 * 7) {
    phaseName = phases[1].title;
    phaseDesc = `During this voter contact phase your main objective is to ${
      phases[1].objective.charAt(0).toLowerCase() + phases[1].objective.slice(1)
    }`;
  } else {
    phaseName = phases[0].title;
    phaseDesc = `During this voter contact phase your main objective is to ${
      phases[0].objective.charAt(0).toLowerCase() + phases[0].objective.slice(1)
    }`;
  }

  return (
    <div className="hidden md:flex justify-between bg-primary-background mt-4 p-6 rounded-lg border border-primary mb-4">
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
        <PhasesModal />
      </div>
    </div>
  );
});
