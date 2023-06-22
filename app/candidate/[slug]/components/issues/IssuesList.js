import H4 from '@shared/typography/H4';
import CandidatePosition from './CandidatePosition';

export default function IssuesList({ candidatePositions, previewMode }) {
  let positions = candidatePositions;
  if (previewMode) {
    positions = candidatePositions.slice(0, 3);
  }
  return (
    <div>
      {positions.length === 0 ? (
        <H4 className="text-indigo-50">No issue selected</H4>
      ) : (
        <H4 className="text-indigo-50">Issues</H4>
      )}
      {positions.map((candidatePosition) => (
        <CandidatePosition
          candidatePosition={candidatePosition}
          key={candidatePosition.id}
        />
      ))}
    </div>
  );
}
