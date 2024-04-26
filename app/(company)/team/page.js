import React, { Suspense } from 'react';
import TeamHero from 'app/(company)/team/components/TeamHero';
import pageMetaData from 'helpers/metadataHelper';
import gpApi from '../../../gpApi';
import gpFetch from '../../../gpApi/gpFetch';
import TeamMembersSection from 'app/(company)/team/components/TeamMembersSection';
import OurImpact from 'app/(company)/team/components/OurImpact';
import Funding from 'app/(company)/team/components/Funding';
import LeadingTheMovement from 'app/(company)/team/components/LeadingTheMovement';
import { TeamMilestones } from 'app/(company)/team/components/TeamMilestones';
import MoreQuestions from 'app/(company)/team/components/MoreQuestions';
import { theme } from 'tailwind.config';
import { SlantSection } from '@shared/landing-pages/SlantSection';

const meta = pageMetaData({
  title: 'Team | GOOD PARTY',
  description:
    'Good Party’s core team are the people working full-time, part-time, or as dedicated volunteer contributors on our mission of making people matter more than money in our democracy.',
  slug: '/team',
});
export const metadata = meta;

async function fetchTeamMembers() {
  const api = gpApi.content.contentByKey;
  const [{content: teamMembers}, {content: teamMilestones}] = await Promise.all([
    gpFetch(
      api,
      {
        key: 'goodPartyTeamMembers',
      }, 3600),
    gpFetch(
      api,
      {
        key: 'teamMilestones',
      }, 3600)
  ]);
  return {teamMembers, teamMilestones}
}

const TeamPage = async () => {
  const {teamMembers, teamMilestones} = await fetchTeamMembers();
  return (
    <>
      <TeamHero />
      <OurImpact />
      <Funding />
      <LeadingTheMovement />
      <Suspense>
        <TeamMembersSection
          teamMembers={teamMembers} />
      </Suspense>
      <SlantSection
        colors={[false, theme.extend.colors.mint['50'], '#ffffff']}>
        <TeamMilestones
          teamMilestones={[...teamMilestones, ...teamMilestones, ...teamMilestones]} />
      </SlantSection>
      <MoreQuestions />
    </>
  );
}

export default TeamPage;
