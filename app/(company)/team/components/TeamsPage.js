import React, { Suspense } from 'react';
import TeamHero from 'app/(company)/team/components/TeamHero';
import TeamMembersSection from 'app/(company)/team/components/TeamMembersSection';
import OurImpact from 'app/(company)/team/components/OurImpact';
import Funding from 'app/(company)/team/components/Funding';
import LeadingTheMovement from 'app/(company)/team/components/LeadingTheMovement';
import { TeamMilestones } from 'app/(company)/team/components/TeamMilestones';
import MoreQuestions from 'app/(company)/team/components/MoreQuestions';
import { theme } from 'tailwind.config';
import { SlantSection } from '@shared/landing-pages/SlantSection';
import MaxWidth from '@shared/layouts/MaxWidth';

const TeamPage = ({ teamMembers, teamMilestones }) => (
  <>
    <TeamHero />
    <OurImpact />
    <MaxWidth>
      <Funding />
      <LeadingTheMovement />
    </MaxWidth>
    <TeamMembersSection teamMembers={teamMembers} />
    <SlantSection colors={[false, theme.extend.colors.mint['50'], '#ffffff']}>
      <TeamMilestones teamMilestones={teamMilestones} />
    </SlantSection>
    <MoreQuestions />
  </>
);

export default TeamPage;
