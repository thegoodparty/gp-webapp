import RerunP2V from './RerunP2V';
import { useAdminCampaign } from '@shared/hooks/useAdminCampaign';

export default function VoterFileSection() {
  const [campaign] = useAdminCampaign();

  return (
    <div className="bg-indigo-50 rounded border border-slate-300 p-4 my-12">
      <div>
        {campaign.pathToVictory?.p2vStatus === 'Waiting' ? (
          <div className="my-4">
            Path To Victory is processing... Please wait a few minutes and
            refresh the page.
          </div>
        ) : (
          <div className="my-4">
            If you change the Election Type or Election Location you will need
            to rerun the Path To Victory.
          </div>
        )}
        <RerunP2V />
      </div>
    </div>
  );
}
