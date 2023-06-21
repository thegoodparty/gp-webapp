export const mapTopIssues = (topIssues) => {
  const res = [];
  if (!topIssues || !topIssues.positions) {
    return res;
  }
  topIssues.positions.forEach((position) => {
    const positionWithoutTopIssue = JSON.parse(JSON.stringify(position));
    delete positionWithoutTopIssue.topIssue;
    res.push({
      description: topIssues[`position-${position.id}`],
      id: `position-${position.id}`,
      topIssue: position.topIssue,
      position: positionWithoutTopIssue,
    });
  });
  return res;
};
