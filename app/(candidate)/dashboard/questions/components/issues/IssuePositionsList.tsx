import { IssuePosition } from 'app/(candidate)/dashboard/questions/components/issues/IssuePosition'
import { useCandidatePositions } from 'app/(candidate)/dashboard/campaign-details/components/issues/useCandidatePositions'

interface Position {
  id?: string | number
}

interface CandidatePosition {
  position?: Position
}

const issueAlreadySelected = (position: Position = {} as Position, candidatePositions: CandidatePosition[] = []): boolean => {
  if (!candidatePositions) return false
  return Boolean(
    candidatePositions.find(
      ({ position: candidatePosition = {} as Position } = {} as CandidatePosition) =>
        candidatePosition?.id === position?.id,
    ),
  )
}

interface IssuePositionsListProps {
  positions: Position[]
  selectedPosition?: Position
  handleSelectPosition?: (position: Position) => void
}

export const IssuePositionsList = ({
  positions,
  selectedPosition = {} as Position,
  handleSelectPosition = (_v: Position) => {},
}: IssuePositionsListProps): React.JSX.Element[] => {
  const [candidatePositions] = useCandidatePositions()

  return positions.map((position = {} as Position) => {
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


