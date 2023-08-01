export const dynamic = 'force-dynamic';
import { notFound, redirect } from 'next/navigation';

import { candidateRoute, partyResolver } from 'helpers/candidateHelper';
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import { fetchCandidate } from '../page';
import EditCandidatePage from '../components/EditCandidatePage';
import { fetchPositions } from 'app/(candidate)/onboarding/[slug]/details/[step]/page';
import pageMetaData from 'helpers/metadataHelper';
import { mapTopIssues } from './mapTopIssues';
import mapCampaignToCandidate from './mapCampaignToCandidate';
import UserSnapScript from '@shared/scripts/UserSnapScript';

export async function generateMetadata({ params }) {
  const { slug } = params;

  let res = await fetchCandidate(slug);
  let campaign;
  if (!res) {
    ({ campaign } = await fetchUserCampaign());
    if (campaign) {
      campaign = mapCampaignToCandidate(campaign);
    }
  } else {
    campaign = res.candidate;
  }

  const { firstName, lastName, party, otherParty, office, headline } = campaign;

  const title = `${firstName} ${lastName} ${partyResolver(party, otherParty)} ${
    party !== 'Independent' ? 'Party ' : ''
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
  let { campaign } = await fetchUserCampaign();
  if (!res) {
    isStaged = true;
    if (campaign) {
      const mapped = mapCampaignToCandidate(campaign);
      res = {
        candidate: mapped,
      };
    } else {
      notFound();
    }
  }

  const { candidate } = res;
  let { candidatePositions } = res;

  if (!candidate) {
    notFound();
  }

  if (candidateRoute(candidate) !== `/candidate/${slug}`) {
    redirect(candidateRoute(candidate));
  }

  const { positions } = await fetchPositions();

  if (isStaged) {
    candidatePositions = mapTopIssues(campaign.details?.topIssues);
  }

  const childProps = {
    campaign,
    candidate,
    editMode: true,
    isStaged,
    candidatePositions,
    positions, // for issuesSelector
  };

  return (
    <>
      <EditCandidatePage {...childProps} />
      <UserSnapScript />
      {/* <CandidateSchema candidate={candidate} /> */}
      {/* <TrackVisit /> */}
    </>
  );
}
