import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import IssuesSelector from './IssuesSelector';

export default function AddIssues(props) {
  return (
    <div>
      <H1 className="mb-10 text-center">What issues do you care about?</H1>
      <Body1 className="my-8 text-center">
        Choose 3 issues that matter a lot to you. They will be the focus of your
        campaign and help you connect with voters.
      </Body1>
      <IssuesSelector {...props} />
    </div>
  );
}
