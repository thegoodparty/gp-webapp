import CandidateProfile from './CandidateProfile';
import ProgressMeter from './ProgressMeter';
import TopIssuesPills from './TopIssuesPills';

export default function Header({ candidate, candidatePositions, followers }) {
  return (
    <div className="pt-9 pb-14 lg:pt-14 lg:pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
        <div>
          <CandidateProfile candidate={candidate} />
          <TopIssuesPills
            candidate={candidate}
            candidatePositions={candidatePositions}
          />
        </div>
        <div className="pl-4">
          <ProgressMeter candidate={candidate} followers={followers} />
        </div>
      </div>
    </div>
  );
}
