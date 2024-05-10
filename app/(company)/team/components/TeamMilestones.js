import { IoArrowForwardSharp } from 'react-icons/io5';
import { TeamMilestonesCarousel } from 'app/(company)/team/components/TeamMilestonesCarousel';

export const TeamMilestones = ({ teamMilestones }) => (
  <section className="bg-mint-50 px-4 pt-8 pb-32">
    <h3 className="text-4xl leading-tight mb-8 md:mb-16">
      Our milestones
      <IoArrowForwardSharp className="hidden md:inline ml-4" />
    </h3>
    <TeamMilestonesCarousel teamMilestones={teamMilestones} />
  </section>
);
