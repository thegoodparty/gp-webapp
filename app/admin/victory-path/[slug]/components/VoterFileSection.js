import RerunP2V from './RerunP2V';
import { useCampaign } from '@shared/hooks/useCampaign';

export default function VoterFileSection() {
  const [campaign] = useCampaign();

  if (
    campaign.pathToVictory?.electionType &&
    campaign.pathToVictory?.electionLocation
  ) {
    return null;
  }

  return (
    <div className="bg-indigo-50 rounded border border-slate-300 p-4 my-12">
      <div>
        {campaign.pathToVictory?.p2vStatus === 'Waiting' ? (
          <div className="my-4">Path To Victory is processing...</div>
        ) : (
          <div className="my-4">
            This campaign does not have a L2 election column. (Older path to
            victory didn&apos;t save that column)
          </div>
        )}
        <RerunP2V />
      </div>
    </div>
  );
}
