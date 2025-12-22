import React from 'react'
import TeamHero from 'app/(company)/team/components/TeamHero'
import TeamMembersSection from 'app/(company)/team/components/TeamMembersSection'
import OurImpact from 'app/(company)/team/components/OurImpact'
import Funding from 'app/(company)/team/components/Funding'
import LeadingTheMovement from 'app/(company)/team/components/LeadingTheMovement'
import MoreQuestions from 'app/(company)/team/components/MoreQuestions'
import MaxWidth from '@shared/layouts/MaxWidth'

interface PhotoData {
  url: string
  alt?: string
}

interface TeamMember {
  id: string
  fullName: string
  role: string
  partyRole?: string
  goodPhoto?: PhotoData
  partyPhoto?: PhotoData
}

interface TeamPageProps {
  teamMembers?: TeamMember[]
}

const TeamPage = ({ teamMembers }: TeamPageProps): React.JSX.Element => (
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
)

export default TeamPage
