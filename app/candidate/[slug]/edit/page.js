export const dynamic = 'force-dynamic';
import { notFound, redirect } from 'next/navigation';

import { candidateRoute } from 'helpers/candidateHelper';
import { fetchCandidates } from 'app/candidates/[[...filters]]/page';
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import { fetchCandidate } from '../page';
import EditCandidatePage from '../components/EditCandidatePage';
import { fetchPositions } from 'app/(candidate)/onboarding/[slug]/details/[step]/page';
import pageMetaData from 'helpers/metadataHelper';

export async function generateMetadata({ params }) {
  const { slug } = params;
  const { candidate } = await fetchCandidate(slug);
  const { firstName, lastName, party, otherParty, office, headline } =
    candidate;

  const title = `${firstName} ${lastName} ${partyResolver(party, otherParty)} ${
    party !== 'I' ? 'Party ' : ''
  }candidate for ${office}`;

  const description = `Join the crowd-voting campaign for ${firstName} ${lastName}, ${partyResolver(
    party,
    otherParty,
  ).toLowerCase()} for ${office} | ${
    headline ? ` ${headline} | ` : ' '
  }Crowd-voting on GOOD PARTY`;

  const meta = pageMetaData({
    title,
    description,
    slug: `/candidate/${slug}/edit`,
  });
  return meta;
}

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

  const { positions } = await fetchPositions();

  const childProps = {
    campaign,
    candidate,
    editMode: true,
    isStaged,
    candidatePositions: mapTopIssues(campaign.details?.topIssues),
    positions, // for issuesSelector
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
    voteGoal: parseInt(voteGoal) || 0,
    voterProjection: parseInt(voterProjection) || 0,
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
