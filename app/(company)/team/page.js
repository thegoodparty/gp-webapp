import React, { Suspense } from 'react';
import MaxWidth from '@shared/layouts/MaxWidth';
import Hero from './components/Hero';
import Volunteers from './components/Volunteers';
import Interns from './components/Interns';
import pageMetaData from 'helpers/metadataHelper';
import gpApi from '../../../gpApi';
import gpFetch from '../../../gpApi/gpFetch';
import TeamSection from './components/TeamSection';

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
    <MaxWidth>
      <Hero />
      <Suspense>
        <TeamSection teamMembers={teamMembers} title="Good Party Team" />
      </Suspense>
      <Suspense>
        <Interns />
      </Suspense>
      <Suspense>
        <Volunteers />
      </Suspense>
    </MaxWidth>
  );
}

export default TeamPage;
