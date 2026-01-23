'use client'
import IssuesList from './IssuesList'
import { useCandidatePositions } from 'app/(candidate)/dashboard/campaign-details/components/issues/useCandidatePositions'
import { loadCandidatePosition } from 'app/(candidate)/dashboard/campaign-details/components/issues/issuesUtils'
import type { ComponentProps } from 'react'
import type { Campaign, CandidatePosition } from 'helpers/types'

type IssuesListProps = ComponentProps<typeof IssuesList>

interface IssuesSelectorProps
  extends Omit<IssuesListProps, 'nextCallback' | 'campaign' | 'topIssues'> {
  completeCallback?: (value: string) => void | Promise<void>
  updatePositionsCallback?: (
    value: CandidatePosition[] | false,
  ) => Promise<void>
  campaign: Campaign
  topIssues?: IssuesListProps['topIssues']
}

const IssuesSelector = (props: IssuesSelectorProps): React.JSX.Element => {
  const {
    completeCallback = () => {},
    updatePositionsCallback = async () => {},
    campaign,
    editIssuePosition,
    topIssues = [],
  } = props
  const [candidatePositions, setCandidatePositions] = useCandidatePositions()

  const updateCandidatePositions = async () => {
    const candidatePositions = await loadCandidatePosition(campaign.id)
    setCandidatePositions(candidatePositions)
    return candidatePositions
  }

  const combinedIssuedCount =
    (Array.isArray(candidatePositions) ? candidatePositions.length : 0) +
    (campaign?.details?.customIssues?.length || 0)
  const issueNum = combinedIssuedCount + 1

  const nextCallback = async () => {
    await updatePositionsCallback(await updateCandidatePositions())
    if (Number(completeCallback) >= 3) {
      await completeCallback('issues')
    }
  }

  const prompt = editIssuePosition
    ? 'Choose An Issue'
    : `Choose Issue #${issueNum}`

  return (
    <div>
      <h4
        className="
          text-center
          text-xl
          font-medium
          mb-9
        "
      >
        {prompt}
      </h4>
      <IssuesList
        {...props}
        campaign={campaign}
        nextCallback={nextCallback}
        order={issueNum}
        key={`${issueNum}-${(Math.random() + 1).toString(36).substring(4)}`}
        editIssuePosition={editIssuePosition}
        topIssues={topIssues}
      />
    </div>
  )
}

export default IssuesSelector
