import Body1 from '@shared/typography/Body1';
import H2 from '@shared/typography/H2';
import MarketingH2 from '@shared/typography/MarketingH2';
import { AlertBanner } from '../AlertBanner';
import { numberFormatter } from 'helpers/numberHelper';
import { BsInfoCircle } from 'react-icons/bs';
import { AnimatedProgressBar } from 'app/(candidate)/dashboard/components/p2v/AnimatedProgressBar';
import { P2vModal } from './P2vModal';
import { EVENTS, trackEvent } from 'helpers/fullStoryHelper';
import { calculateVoterContactCounts } from 'app/(candidate)/dashboard/components/voterGoalsHelpers';

export function ContactedBarSection(props) {
  const { pathToVictory, reportedVoterGoals } = props;
  const { needed, contacted } = calculateVoterContactCounts(
    pathToVictory,
    reportedVoterGoals,
  );

  const percent = (contacted / needed) * 100;
  let textColor = 'text-black';
  let severity = 'info';
  if (contacted > 0) {
    textColor = 'text-error-main';
    severity = 'error';
  }
  if (percent > 20) {
    textColor = 'text-warning-main';
    severity = 'warning';
  }
  if (percent > 75) {
    textColor = 'text-success-main';
    severity = 'success';
  }

  return (
    <div className="p-6 border border-slate-300 rounded-lg mt-4 md:mt-0">
      <div className="md:flex justify-between">
        <div className="md:flex items-baseline mb-4 ">
          <MarketingH2 className={`${textColor} text-center md:text-left`}>
            {Math.floor(percent)}%
          </MarketingH2>
          <H2 className="ml-2 text-center md:text-left">of voters contacted</H2>
        </div>
        {percent > 0 && (
          <div className="md:pl-2 md:max-w-xs">
            <AlertBanner
              message="Contact more voters to increase your chances of winning."
              severity={severity}
            />
          </div>
        )}
      </div>
      <Body1 className="text-center md:text-left mb-2">
        <strong>Current:</strong> {numberFormatter(contacted)} voters
      </Body1>
      <AnimatedProgressBar percent={(contacted / needed) * 100} />

      <P2vModal
        triggerElement={
          <div
            className="mt-2 flex justify-center md:justify-end items-center"
            onClick={() =>
              trackEvent(EVENTS.Dashboard.PathToVictory.ClickContactsNeeded)
            }
          >
            <Body1>
              <strong>Needed:</strong> {numberFormatter(needed)} voter contacts
            </Body1>
            <BsInfoCircle className="ml-2" />
          </div>
        }
        pathToVictory={pathToVictory}
      />
    </div>
  );
}
