export const dynamic = 'force-dynamic';
import { notFound, redirect } from 'next/navigation';

import { candidateRoute } from 'helpers/candidateHelper';
import CandidatePage from '../components/CandidatePage';
import { fetchCandidates } from 'app/candidates/[[...filters]]/page';
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import { fetchCandidate } from '../page';

export default async function Page({ params }) {
  const { slug } = params;
  let isStaged = false;
  let res = await fetchCandidate(slug);
  if (!res) {
    isStaged = true;
    const { campaign } = await fetchUserCampaign();
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
    candidate,
    editMode: true,
    isStaged,
  };

  return (
    <>
      <CandidatePage {...childProps} />
      {/* <CandidateSchema candidate={candidate} /> */}
      {/* <TrackVisit /> */}
    </>
  );
}

function mapCampaignToCandidate(campaign) {
  if (!campaign) {
    return false;
  }
  console.log('cmapaign', campaign);
  const { slug, details, campaignPlan, pathToVictory } = campaign;
  const {
    firstName,
    lastName,
    party,
    state,
    office,
    pastExperience,
    occupation,
    funFact,
    topIssues,
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
    topIssues,
    voteGoal,
    voterProjection,
  };
}
