import H4 from '@shared/typography/H4'
import CandidatePosition from './CandidatePosition'
import { Campaign, CustomIssue } from 'helpers/types'

interface TopIssueData {
  name?: string
}

interface PositionData {
  name?: string
}

interface CandidatePositionData {
  id?: number
  order?: number
  description?: string
  position?: PositionData
  topIssue?: TopIssueData
}

interface TransformedPosition {
  order?: number
  description: string
  isCustom?: boolean
  position?: { name?: string }
  topIssue?: { name?: string }
  id: number | string
}

interface IssuesListProps {
  candidatePositions?: CandidatePositionData[]
  previewMode?: boolean
  candidate: Campaign
}

export const combinePositions = (
  candidatePositions?: CandidatePositionData[],
  customPositions?: CustomIssue[],
): TransformedPosition[] => {
  if (!candidatePositions && !customPositions) {
    return []
  }
  if (!customPositions || customPositions.length === 0) {
    return (candidatePositions || []).map((pos, index) => ({
      order: pos.order,
      description: pos.description || '',
      isCustom: false,
      position: pos.position,
      topIssue: pos.topIssue,
      id: pos.id ?? index,
    }))
  }
  const transformed: TransformedPosition[] = customPositions.map((pos, index) => {
    return {
      order: index,
      description: pos.position,
      isCustom: true,
      position: { name: pos.title },
      topIssue: { name: 'custom' },
      id: `custom-${index}`,
    }
  })
  const candidateTransformed: TransformedPosition[] = (candidatePositions || []).map((pos, index) => ({
    order: pos.order,
    description: pos.description || '',
    isCustom: false,
    position: pos.position,
    topIssue: pos.topIssue,
    id: pos.id ?? index,
  }))
  
  const combined = [...candidateTransformed, ...transformed]
  const sorted = combined.sort((a, b) => {
    return (a.order || 0) - (b.order || 0)
  })

  sorted.forEach((item, index) => {
    item.order = index
  })

  return sorted
}

export default function IssuesList({
  candidatePositions,
  previewMode,
  candidate,
}: IssuesListProps): React.JSX.Element {
  let positions = combinePositions(
    candidatePositions,
    candidate.details?.customIssues,
  )

  if (previewMode) {
    positions = positions.slice(0, 3)
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
          previewMode={previewMode}
        />
      ))}
    </div>
  )
}
