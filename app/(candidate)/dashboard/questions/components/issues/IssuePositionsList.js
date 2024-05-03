import { IssuePosition } from 'app/(candidate)/dashboard/questions/components/issues/IssuePosition';

export const IssuePositionsList = ({
  positions,
  selectedPosition = {},
  handleSelectPosition = (v) => {},
}) =>
  positions.map((position = {}) => (
    <IssuePosition
      key={position.id}
      position={position}
      selected={selectedPosition?.id === position.id}
      handleSelectPosition={handleSelectPosition}
    />
  ));
