import Body1 from '@shared/typography/Body1';
import H4 from '@shared/typography/H4';
import { FaLayerGroup } from 'react-icons/fa';
import IssuesIcon from './IssuesIcon';

export default function CandidatePosition({ candidatePosition }) {
  const { topIssue, position, description } = candidatePosition;
  return (
    <div
      key={candidatePosition.id}
      className="bg-slate-200 rounded-2xl px-5 pt-5 pb-11 mt-4 flex"
    >
      <div className="pt-2 mr-2">
        <IssuesIcon issueName={topIssue?.name} />
      </div>
      <div>
        <H4 className="">
          {topIssue?.name} | {position?.name}
        </H4>
        <Body1 className="mt-3">{description}</Body1>
      </div>
    </div>
  );
}
