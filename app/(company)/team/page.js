import React from 'react';
import pageMetaData from 'helpers/metadataHelper';

import TeamPage from './components/TeamsPage';
import { apiRoutes } from 'gpApi/routes';
import { serverFetch } from 'gpApi/serverFetch';

const meta = pageMetaData({
  title: 'Team | GoodParty.org',
  description:
    "GoodParty.org's core team are the people working full-time, part-time, or as dedicated volunteer contributors on our mission of making people matter more than money in our democracy.",
  slug: '/team',
});
export const metadata = meta;

async function fetchTeamMembersAndMilestones() {
  const api = apiRoutes.content.getByType;
  const [{ data: teamMembers }, { data: teamMilestones }] = await Promise.all([
    serverFetch(
      api,
      {
        type: 'goodPartyTeamMembers',
      },
      { revalidate: 3600 },
    ),
    serverFetch(
      api,
      {
        type: 'teamMilestone',
      },
      { revalidate: 3600 },
    ),
  ]);
  return { teamMembers, teamMilestones };
}

const Page = async () => {
  const { teamMembers, teamMilestones } = await fetchTeamMembersAndMilestones();
  const childProps = {
    teamMembers,
    teamMilestones,
  };
  return <TeamPage {...childProps} />;
};

export default Page;
