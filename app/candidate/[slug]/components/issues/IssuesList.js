import H4 from '@shared/typography/H4';
import CandidatePosition from './CandidatePosition';

export const combinePositions = (candidatePositions, customPositions) => {
  if (!candidatePositions && !customPositions) {
    return [];
  }
  if (!customPositions || customPositions.length === 0) {
    return candidatePositions;
  }
  const transformed = customPositions.map((pos) => {
    return {
      order: pos.order || 1, // remove later
      description: pos.position,
      isCustom: true,
      position: { name: pos.title },
      topIssue: { name: 'custom' },
    };
  });
  const combined = [...candidatePositions, ...transformed];
  const sorted = combined.sort((a, b) => {
    return a.order - b.order;
  });

  return sorted;
};

export default function IssuesList({
  candidatePositions,
  previewMode,
  candidate,
}) {
  console.log('candidate.customIssues', candidate.customIssues);
  let positions = combinePositions(candidatePositions, candidate.customIssues);

  if (previewMode) {
    positions = positions.slice(0, 3);
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
