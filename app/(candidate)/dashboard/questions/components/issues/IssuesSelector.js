'use client';
import IssuesList from './IssuesList';
export default function IssuesSelector(props) {
  const {
    completeCallback = (v) => {},
    updatePositionsCallback = async () => {},
    candidatePositions,
    campaign,
    editIssuePosition,
  } = props;

  const combinedIssuedCount =
    (candidatePositions?.length || 0) +
    (campaign?.details?.customIssues?.length || 0);
  const issueNum = combinedIssuedCount + 1;

  const nextCallback = async () => {
    if (combinedIssuedCount < 3) {
      updatePositionsCallback();
    } else {
      await updatePositionsCallback();
      await completeCallback('issues');
    }
  };

  const prompt = editIssuePosition
    ? 'Choose An Issue'
    : `Choose Issue #${issueNum}`;

  return (
    <div>
      <h4 className="text-center text-xl font-medium mb-9">{prompt}</h4>
      <IssuesList
        {...props}
        campaign={campaign}
        nextCallback={nextCallback}
        order={issueNum}
        key={`${issueNum}-${(Math.random() + 1).toString(36).substring(4)}`}
        editIssuePosition={editIssuePosition}
      />
    </div>
  );
}
