import EditIssuesSection from './EditIssuesSection';
import IssuesSection from './IssuesSection';

export default function IssuesSectionWithEdit(props) {
  const { editMode } = props;

  return (
    <>
      {editMode ? (
        <EditIssuesSection {...props} />
      ) : (
        <IssuesSection {...props} />
      )}
    </>
  );
}
