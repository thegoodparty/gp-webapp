import H3 from '@shared/typography/H3';
import Body1 from '@shared/typography/Body1';
import PurchaseVoterFile from './PurchaseVoterFile';
import RerunP2V from './RerunP2V';

export default function VoterFileSection(props) {
  const { campaign } = props;

  let status = 'noElectionType';
  if (
    campaign.pathToVictory?.electionType &&
    campaign.pathToVictory?.electionLocation
  ) {
    status = 'hasElectionType';
  }
  if (campaign.data?.hasVoterFile === 'processing') {
    status = 'processingVoterFile';
  }
  if (campaign.data?.hasVoterFile === 'completed') {
    status = 'hasVoterFile';
  }

  return (
    <div className="bg-indigo-50 rounded border border-slate-300 p-4 my-12">
      <H3>Voter File (pro account)</H3>
      {status === 'noElectionType' && (
        <div>
          {campaign.pathToVictory?.p2vStatus === 'Waiting' ? (
            <div className="my-4">Path To Victory is processing...</div>
          ) : (
            <div className="my-4">
              This campaign does not have a L2 election column. (Older path to
              victory didn&apos;t save that column)
            </div>
          )}
          <RerunP2V {...props} />
        </div>
      )}
      {status === 'hasElectionType' && campaign.isPro && (
        <div>
          <PurchaseVoterFile {...props} />
          <Body1 className="mt-4">
            Note: this might take a few minutes to complete.
          </Body1>
        </div>
      )}
      {status === 'processingVoterFile' && campaign.isPro && (
        <div>
          The voter file is being purchased. This might take a few minutes.
          Please refresh the page to update the status
          <PurchaseVoterFile {...props} />
        </div>
      )}
      {status === 'hasVoterFile' && (
        <div>This campaign already has a voter file.</div>
      )}
    </div>
  );
}
