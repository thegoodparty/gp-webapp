import { IoArrowForwardSharp } from 'react-icons/io5';
import { TeamMilestonesCarousel } from 'app/(company)/team/components/TeamMilestonesCarousel';
import MaxWidth from '@shared/layouts/MaxWidth';

export const TeamMilestones = ({ teamMilestones }) => (
  <section className="bg-mint-50 pt-8 pb-32">
    <MaxWidth>
      <h3 className="text-4xl leading-tight mb-8 md:mb-16">
        Our milestones
        <IoArrowForwardSharp className="hidden md:inline ml-4" />
      </h3>
      <TeamMilestonesCarousel teamMilestones={teamMilestones} />
    </MaxWidth>
  </section>
);
