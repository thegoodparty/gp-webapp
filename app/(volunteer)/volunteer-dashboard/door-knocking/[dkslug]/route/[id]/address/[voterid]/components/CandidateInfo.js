import Body1 from '@shared/typography/Body1';
import Body2 from '@shared/typography/Body2';
import H2 from '@shared/typography/H2';
import Overline from '@shared/typography/Overline';
import { dateUsHelper } from 'helpers/dateHelper';

export default function CandidateInfo(props) {
  const campaign = props.voter.campaign;
  const { firstName, lastName, electionDate, customIssues, positions } =
    campaign;

  const sortedIssues = [];
  if (positions) {
    positions?.forEach((position) => {
      sortedIssues.push({ ...position, type: 'position' });
    });
  }
  if (customIssues) {
    customIssues?.forEach((issue) => {
      sortedIssues.push({ ...issue, type: 'custom' });
    });
  }
  sortedIssues.sort((a, b) => a.order - b.order);

  const candidateName = `${firstName || details.firstName || ''} ${
    lastName || details.lastName || ''
  }`;

  return (
    <section>
      <div className="p-4 rounded-lg bg-white mb-4">
        <Overline>CANDIDATE</Overline>
        <H2 className="mt-2">{candidateName}</H2>
      </div>
      <div className="p-4 rounded-lg bg-white mb-4">
        <Overline>ELECTION DATE</Overline>
        <H2 className="mt-2">{dateUsHelper(electionDate)}</H2>
      </div>
      {sortedIssues.map((issue) => (
        <div className="p-4 rounded-lg bg-white mb-4" key={issue.order}>
          {issue.type === 'position' ? (
            <div>
              <Overline>KEY ISSUE</Overline>
              <H2 className="mt-2">{issue.topIssue}</H2>
              <Body1 className="mt-1">{issue.position}</Body1>
              <Body2 className="mt-1">{issue.title}</Body2>
            </div>
          ) : (
            <div>
              <Overline>KEY ISSUE</Overline>
              <H2 className="mt-2">{issue.title}</H2>
              <Body1 className="mt-1">{issue.position}</Body1>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
