import React from 'react';
import pageMetaData from 'helpers/metadataHelper';

import TeamPage from './components/TeamsPage';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

const meta = pageMetaData({
  title: 'Team | GOOD PARTY',
  description:
    "Good Party's core team are the people working full-time, part-time, or as dedicated volunteer contributors on our mission of making people matter more than money in our democracy.",
  slug: '/team',
});
export const metadata = meta;

async function fetchTeamMembers() {
  try {
    const api = gpApi.content.contentByKey;
    const payload = {
      key: 'goodPartyTeamMembers',
    };
    return await gpFetch(api, payload, 3600);
  } catch (e) {
    return false;
  }
}

async function fetchMilestones() {
  try {
    const api = gpApi.content.contentByKey;
    const payload = {
      key: 'teamMilestones',
    };
    return await gpFetch(api, payload, 3600);
  } catch (e) {
    return false;
  }
}

const Page = async () => {
  const res1 = await fetchTeamMembers();
  const teamMembers = res1.content;

  const res2 = await fetchMilestones();
  const teamMilestones = res2.content;
  const childProps = { teamMembers, teamMilestones };
  return <TeamPage {...childProps} />;
};

export default Page;
