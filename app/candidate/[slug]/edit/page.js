export const dynamic = 'force-dynamic';
import { notFound, redirect } from 'next/navigation';

import { candidateRoute } from 'helpers/candidateHelper';
import { fetchCandidates } from 'app/candidates/[[...filters]]/page';
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import { fetchCandidate } from '../page';
import EditCandidatePage from '../components/EditCandidatePage';

export default async function Page({ params }) {
  const { slug } = params;
  let isStaged = false;
  let res = await fetchCandidate(slug);
  let campaign;
  if (!res) {
    isStaged = true;
    ({ campaign } = await fetchUserCampaign());
    if (campaign) {
      const mapped = mapCampaignToCandidate(campaign);
      res = {
        candidate: mapped,
      };
    }
  } else {
    notFound();
  }

  const { candidate } = res;

  if (!candidate) {
    notFound();
  }

  if (candidateRoute(candidate) !== `/candidate/${slug}`) {
    redirect(candidateRoute(candidate));
  }

  const childProps = {
    campaign,
    candidate,
    editMode: true,
    isStaged,
    candidatePositions: mapTopIssues(campaign.details?.topIssues),
  };

  return (
    <>
      <EditCandidatePage {...childProps} />
      {/* <CandidateSchema candidate={candidate} /> */}
      {/* <TrackVisit /> */}
    </>
  );
}

function mapCampaignToCandidate(campaign) {
  if (!campaign) {
    return false;
  }
  const {
    slug,
    details,
    campaignPlan,
    pathToVictory,
    color,
    image,
    twitter,
    instagram,
    facebook,
    linkedin,
    tiktok,
    snap,
    twitch,
    hashtag,
    website,
  } = campaign;
  const {
    firstName,
    lastName,
    party,
    state,
    office,
    pastExperience,
    occupation,
    funFact,
  } = details;
  const { slogan, aboutMe, why } = campaignPlan;

  let voteGoal, voterProjection;
  if (pathToVictory) {
    ({ voteGoal, voterProjection } = pathToVictory);
  }
  return {
    slug,
    firstName,
    lastName,
    party,
    state,
    office,
    slogan,
    about: aboutMe,
    why,
    pastExperience,
    occupation,
    funFact,
    voteGoal,
    voterProjection,
    color,
    image,
    twitter,
    instagram,
    facebook,
    linkedin,
    tiktok,
    snap,
    twitch,
    hashtag,
    website,
  };
}

const mapTopIssues = (topIssues) => {
  const res = [];
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
