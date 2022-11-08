import Link from 'next/link';
import {
  candidateColor,
  candidateRoute,
  partyRace,
} from '/helpers/candidateHelper';

const MAX_POSITIONS = 6;

export default function CandidateCard({ candidate, withFollowButton = false }) {
  if (!candidate) {
    return <></>;
  }
  const { firstName, lastName, positions, followers, support } = candidate;

  const brightColor = candidateColor(candidate);
  let topPositions = positions;

  if (positions && positions.length > MAX_POSITIONS) {
    topPositions = positions.slice(0, MAX_POSITIONS);
  }

  let thisWeek = 0;
  if (followers) {
    thisWeek = followers.thisWeek + (support ? support.thisWeek : 0);
  }

  const WrapperElement = ({ children }) => {
    if (withFollowButton) {
      return (
        <div
          id={`candidate-card-${firstName}-${lastName}`}
          className="candidate-card"
        >
          {children}
        </div>
      );
    }
    return (
      <Link
        href={candidateRoute(candidate)}
        passHref
        style={{ height: '100%' }}
        className="no-underline candidate-card"
        data-cy="candidate-link"
        id={`candidate-card-${firstName}-${lastName}`}
      >
        {children}
      </Link>
    );
  };

  return (
    <WrapperElement>
      <div className="rounded-2xl pt-6 px-6 pb-24 border-2 border-solid border-gray-200 h-full relative bg-white">
        <div className="flex justify-center">Img here</div>
        <h3 className="text-xl font-semibold mb-2 mt-6">
          {firstName} {lastName}
        </h3>
        <div className="text-neutral-600">{partyRace(candidate)}</div>
      </div>
    </WrapperElement>
  );
}
