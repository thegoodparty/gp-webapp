import { candidateRoute } from '/helpers/candidateHelper';
import { removeWhiteSpaces } from '/helpers/stringHelper';
import Link from 'next/link';

export default function TopIssuesPills({ candidatePositions, candidate }) {
  if (candidatePositions?.length === 0) {
    return <></>;
  }
  return (
    <div className="mt-4 lg:hidden">
      {candidatePositions.map((candPosition) => (
        <Link
          key={candPosition.id}
          href={`${candidateRoute(candidate)}#${removeWhiteSpaces(
            candPosition.position?.name,
          )}`}
        >
          <div
            className="issue inline-block bg-gray-200 rounded py-2 px-4 mt-3 mr-3 font-black cursor-pointer transition hover:bg-neutral-200"
            data-cy="top-issue-position"
          >
            {candPosition.position?.name}
          </div>
        </Link>
      ))}
    </div>
  );
}
