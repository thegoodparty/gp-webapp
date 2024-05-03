export const findExistingCustomIssueIndex = (
  { details: { customIssues = [] } = {} } = {},
  editIssuePosition,
  selectIssueCallback = (v) => {},
) => {
  const index = customIssues.findIndex(
    (customIssue) =>
      customIssue.title === editIssuePosition?.title &&
      customIssue.position === editIssuePosition?.position,
  );
  index !== -1 && selectIssueCallback('custom');
  return index;
};
