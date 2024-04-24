import React, { Suspense } from 'react';
import TeamHero from 'app/(company)/team/components/TeamHero';
import pageMetaData from 'helpers/metadataHelper';
import gpApi from '../../../gpApi';
import gpFetch from '../../../gpApi/gpFetch';
import TeamSection from './components/TeamSection';
import OurImpact from 'app/(company)/team/components/OurImpact';
import Funding from 'app/(company)/team/components/Funding';
import LeadingTheMovement
  from 'app/(company)/team/components/LeadingTheMovement';

const meta = pageMetaData({
  title: 'Team | GOOD PARTY',
  description:
    'Good Party’s core team are the people working full-time, part-time, or as dedicated volunteer contributors on our mission of making people matter more than money in our democracy.',
  slug: '/team',
});
export const metadata = meta;

async function fetchTeamMembers() {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'goodPartyTeamMembers',
  };
  return await gpFetch(api, payload, 3600);
}

const TeamPage = async () => {
  const {content: teamMembers} = await fetchTeamMembers();

  console.log(`SERVER teamMembers =>`, teamMembers)

  return (
    <>
      <TeamHero />
      <OurImpact />
      <Funding />
      <LeadingTheMovement />
      <Suspense>
        <TeamSection teamMembers={teamMembers} />
      </Suspense>
    </>
  );
}

export default TeamPage;
