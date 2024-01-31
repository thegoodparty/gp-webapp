'use client';

import { FaChevronRight } from 'react-icons/fa6';
import IssueItem from './IssueItem';

export default function IssuesList(props) {
  const { topIssues } = props;
  console.log('topIssues', topIssues);
  return (
    <div>
      {/* <div>search</div> */}
      {topIssues.map((topIssue) => (
        <IssueItem topIssue={topIssue} key={topIssue.id} />
      ))}
    </div>
  );
}
