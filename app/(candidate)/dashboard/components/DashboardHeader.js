'use client';
import { useCampaign } from '@shared/hooks/useCampaign';
import { CampaignCountdown } from 'app/(candidate)/dashboard/components/CampaignCountdown';
import { VoterContactsCount } from 'app/(candidate)/dashboard/components/VoterContactsCount';
import { RemainingTasks } from 'app/(candidate)/dashboard/components/RemainingTasks';

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
      <CampaignProgress />
    </section>
  );
};

const CampaignProgress = () => {};
