import pageMetaData from 'helpers/metadataHelper';
import './globals.css';
import HomePage from './homepage/HomePage';
import OptimizeScript from '@shared/scripts/OptimizeScript';
import { fetchCandidate } from './candidate/[slug]/page';

const meta = pageMetaData({
  title: 'GOOD PARTY | Free tools to change the rules and disrupt the corrupt.',
  description:
    "Not a political party, we're building tools to change the rules, empowering creatives to mobilize community & disrupt the corrupt two-party system. Join us!",
  slug: '/',
});

export const metadata = meta;

export default async function Page() {
  let candidates = [];
  let candidateSlugs = ['tomer-almog', 'taylor-murray'];

  if (process.env.NODE_ENV === 'development') {
    candidateSlugs = ['tomer-almog', 'taylor-murray'];
  }

  for (const slug of candidateSlugs) {
    const { candidate, candidatePositions, reportedVoterGoals } =
      await fetchCandidate(slug);

    let topPosition = '';
    if (candidatePositions && candidatePositions.length > 0) {
      for (const issue of candidatePositions) {
        if (issue?.order && issue.order === 1) {
          topPosition = issue?.position?.name;
          break;
        }
      }
    }
    if (topPosition === '') {
      // only custom issues.
      if (candidate?.customIssues && candidate.customIssues.length > 0) {
        topPosition = candidate.customIssues[0].position;
      }
    }
    if (candidate != undefined) {
      candidate.topPosition = topPosition;
      candidate.reportedVoterGoals = reportedVoterGoals;
      candidates.push(candidate);
    }
  }

  const content = {
    candidates,
  };

  const childProps = {
    content,
  };
  return <HomePage {...childProps} />;
}
