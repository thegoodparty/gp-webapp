import { IssuePosition } from 'app/(candidate)/dashboard/questions/components/issues/IssuePosition';
import { useCandidatePositions } from 'app/(candidate)/dashboard/questions/components/issues/useCandidatePositions';

const issueAlreadySelected = (position = {}, candidatePositions = []) =>
  Boolean(
    candidatePositions.find(
      ({ position: candidatePosition = {} } = {}) =>
        candidatePosition.id === position.id,
    ),
  );

export const IssuePositionsList = ({
  positions,
  selectedPosition = {},
  handleSelectPosition = (v) => {},
}) => {
  const [candidatePositions] = useCandidatePositions();
  console.log(`candidatePositions =>`, candidatePositions);
  return positions.map((position = {}) => {
    const selected = selectedPosition?.id === position.id;
    return (
      <IssuePosition
        key={position.id}
        position={position}
        selected={selected}
        handleSelectPosition={handleSelectPosition}
        disabled={
          issueAlreadySelected(position, candidatePositions) && !selected
        }
      />
    );
  });
};
