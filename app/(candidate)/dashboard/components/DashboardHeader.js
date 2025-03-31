'use client';
import { useCampaign } from '@shared/hooks/useCampaign';
import { CampaignCountdown } from 'app/(candidate)/dashboard/components/CampaignCountdown';
import { VoterContactsCount } from 'app/(candidate)/dashboard/components/VoterContactsCount';
import H4 from '@shared/typography/H4';

export const DashboardHeader = ({ reportedVoterGoals }) => {
  const [campaign] = useCampaign();
  const { pathToVictory: p2vObject, details: campaignDetails } = campaign || {};
  const pathToVictory = p2vObject?.data || {};
  const { electionDate: electionDateStr } = campaignDetails || {};
  const electionDate = new Date(electionDateStr);

  return (
    <section className="mb-6">
      <CampaignCountdown electionDate={electionDate} />
      <VoterContactsCount {...{ pathToVictory, reportedVoterGoals }} />
      <RemainingTasks />
    </section>
  );
};

const RemainingTasks = ({ numOfRemainingTasks = 0 }) => (
  <H4>
    You have <strong className="underline">{numOfRemainingTasks} tasks</strong>{' '}
    you need to complete.
  </H4>
);
