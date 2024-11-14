import pageMetaData from 'helpers/metadataHelper';
import './globals.css';
import HomePage from './homepage/HomePage';
import OptimizeScript from '@shared/scripts/OptimizeScript';
// import { fetchCandidate } from './candidate/[slug]/page';

const meta = pageMetaData({
  title: 'GoodParty.org | Empowering independents to run, win and serve.',
  description:
    "We're transforming civic leadership with tools and data that empower independents to run, win and serve without needing partisan or big-money support. Join Us!",
  slug: '/',
});

export const metadata = meta;

export default async function Page() {
  let candidates = [];
  let candidateSlugs = [
    'terry-vo',
    'marty-grohman',
    'guillermo-nurse',
    'benjamin-j-weisner',
    'belinda-gerry',
    'bob-ciullo',
    'michael-woods',
    'crystal-rasnake',
    'hattie-m-robinson',
    'jane-rebelowski',
    'troy-meyers',
  ];

  if (process.env.NODE_ENV === 'development') {
    candidateSlugs = ['tomer-almog', 'taylor-murray'];
  }

  // for (const slug of candidateSlugs) {
  //   const { candidate, candidatePositions, reportedVoterGoals } =
  //     await fetchCandidate(slug);

  //   let topPosition = '';
  //   if (candidatePositions && candidatePositions.length > 0) {
  //     for (const issue of candidatePositions) {
  //       if (issue?.order && issue.order === 1) {
  //         topPosition = issue?.position?.name;
  //         break;
  //       }
  //     }
  //   }
  //   if (topPosition === '') {
  //     // only custom issues.
  //     if (candidate?.customIssues && candidate.customIssues.length > 0) {
  //       topPosition = candidate.customIssues[0].position;
  //     }
  //   }
  //   if (candidate) {
  //     candidate.topPosition = topPosition;
  //     candidate.reportedVoterGoals = reportedVoterGoals;
  //     candidates.push(candidate);
  //   }
  // }

  const content = {
    candidates,
  };

  const childProps = {
    content,
  };
  return <HomePage {...childProps} />;
}
