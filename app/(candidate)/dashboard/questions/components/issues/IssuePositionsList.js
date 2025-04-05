import { IssuePosition } from 'app/(candidate)/dashboard/questions/components/issues/IssuePosition'
import { useCandidatePositions } from 'app/(candidate)/dashboard/campaign-details/components/issues/useCandidatePositions'

const issueAlreadySelected = (position = {}, candidatePositions = []) => {
  if (!candidatePositions) return false
  return Boolean(
    candidatePositions.find(
      ({ position: candidatePosition = {} } = {}) =>
        candidatePosition?.id === position?.id,
    ),
  )
}

export const IssuePositionsList = ({
  positions,
  selectedPosition = {},
  handleSelectPosition = (v) => {},
}) => {
  const [candidatePositions] = useCandidatePositions()

  return positions.map((position = {}) => {
    const selected = selectedPosition?.id === position.id
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
    )
  })
}
