import EditIssues from './EditIssues'
import IssuesList from './IssuesList'

export default function IssuesTab(props) {
  const { editMode } = props
  return (
    <div>
      {editMode ? <EditIssues {...props} /> : <IssuesList {...props} />}
    </div>
  )
}
