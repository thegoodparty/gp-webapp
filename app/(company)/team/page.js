import React from 'react';
import pageMetaData from 'helpers/metadataHelper';

import TeamPage from './components/TeamsPage';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

const meta = pageMetaData({
  title: 'Team | GoodParty.org',
  description:
    "GoodParty.org's core team are the people working full-time, part-time, or as dedicated volunteer contributors on our mission of making people matter more than money in our democracy.",
  slug: '/team',
});
export const metadata = meta;

async function fetchTeamMembersAndMilestones() {
  const api = gpApi.content.contentByKey;
  const [{ content: teamMembers }, { content: teamMilestones }] =
    await Promise.all([
      gpFetch(
        api,
        {
          key: 'goodPartyTeamMembers',
        },
        3600,
      ),
      gpFetch(
        api,
        {
          key: 'teamMilestones',
        },
        3600,
      ),
    ]);
  return { teamMembers, teamMilestones };
}

const sortTeamMembers = (teamMembers) =>
  teamMembers.sort((a, b) => (a.order > b.order ? 1 : -1));

const Page = async () => {
  const { teamMembers, teamMilestones } = await fetchTeamMembersAndMilestones();
  const childProps = {
    teamMembers: sortTeamMembers(teamMembers),
    teamMilestones,
  };
  return <TeamPage {...childProps} />;
};

export default Page;
