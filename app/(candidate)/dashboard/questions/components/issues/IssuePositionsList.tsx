import { IssuePosition } from 'app/(candidate)/dashboard/questions/components/issues/IssuePosition'
import { useCandidatePositions } from 'app/(candidate)/dashboard/campaign-details/components/issues/useCandidatePositions'
import type { ComponentProps } from 'react'
import type { CandidatePosition } from 'helpers/types'

type IssuePositionData = ComponentProps<typeof IssuePosition>['position']

const issueAlreadySelected = (
  position: IssuePositionData,
  candidatePositions: CandidatePosition[] | false = [],
): boolean => {
  if (!candidatePositions) {
    return false
  }
  return Boolean(
    candidatePositions.find(
      (candidatePosition) => candidatePosition.position?.id === position.id,
    ),
  )
}

export const IssuePositionsList = ({
  positions,
  selectedPosition,
  handleSelectPosition = () => {},
}: {
  positions: IssuePositionData[]
  selectedPosition: IssuePositionData | null
  handleSelectPosition?: (position: IssuePositionData) => void
}): React.JSX.Element[] => {
  const [candidatePositions] = useCandidatePositions()

  return positions.map((position) => {
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
