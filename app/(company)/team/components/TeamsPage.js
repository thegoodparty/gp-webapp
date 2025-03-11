import React, { Suspense } from 'react';
import TeamHero from 'app/(company)/team/components/TeamHero';
import TeamMembersSection from 'app/(company)/team/components/TeamMembersSection';
import OurImpact from 'app/(company)/team/components/OurImpact';
import Funding from 'app/(company)/team/components/Funding';
import LeadingTheMovement from 'app/(company)/team/components/LeadingTheMovement';
import MoreQuestions from 'app/(company)/team/components/MoreQuestions';
import MaxWidth from '@shared/layouts/MaxWidth';

const TeamPage = ({ teamMembers }) => (
  <>
    <TeamHero />
    <OurImpact />
    <MaxWidth>
      <Funding />
      <LeadingTheMovement />
    </MaxWidth>
    <TeamMembersSection teamMembers={teamMembers} />
    <MoreQuestions />
  </>
);

export default TeamPage;
