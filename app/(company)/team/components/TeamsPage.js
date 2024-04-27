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

export default function TeamPage({ teamMembers, teamMilestones }) {
  const childProps = [];
  console.log('teamMilestones', teamMilestones);
  if (teamMilestones) {
    childProps.push(...teamMilestones);
    childProps.push(...teamMilestones);
    childProps.push(...teamMilestones);
  }
  return (
    <>
      <TeamHero />
      <OurImpact />
      <Funding />
      <LeadingTheMovement />
      <Suspense>
        <TeamMembersSection teamMembers={teamMembers} />
      </Suspense>
      <SlantSection colors={[false, theme.extend.colors.mint['50'], '#ffffff']}>
        <TeamMilestones teamMilestones={childProps} />
      </SlantSection>
      <MoreQuestions />
    </>
  );
}
