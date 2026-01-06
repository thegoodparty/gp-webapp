import Body1 from '@shared/typography/Body1'
import H4 from '@shared/typography/H4'
import IssuesIcon from './IssuesIcon'

interface TopIssue {
  name?: string
}

interface Position {
  name?: string
}

interface CandidatePositionData {
  id?: number | string
  topIssue?: TopIssue
  position?: Position
  description: string
}

interface CandidatePositionProps {
  candidatePosition: CandidatePositionData
  previewMode?: boolean
}

export default function CandidatePosition({ candidatePosition, previewMode }: CandidatePositionProps): React.JSX.Element {
  const { topIssue, position, description } = candidatePosition
  return (
    <div
      key={candidatePosition.id}
      className="bg-slate-200 rounded-2xl px-5 pt-5 pb-11 mt-4 flex"
    >
      <div className="pt-2 mr-2" title={topIssue?.name}>
        <IssuesIcon issueName={topIssue?.name} />
      </div>
      <div>
        <H4 className="">{position?.name}</H4>
        <Body1 className={`mt-3 ${previewMode ? 'line-clamp-3' : ''}`}>
          {description}
        </Body1>
      </div>
    </div>
  )
}
