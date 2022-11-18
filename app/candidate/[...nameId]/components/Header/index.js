import CandidateProfile from './CandidateProfile';

export default function Header({ candidate }) {
  return (
    <div className="pt-9 pb-14 lg:pt-14 lg:pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <CandidateProfile candidate={candidate} />
        <div>social stats</div>
      </div>
    </div>
  );
}
