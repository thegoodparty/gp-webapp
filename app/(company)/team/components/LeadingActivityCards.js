import { LuPartyPopper } from 'react-icons/lu';
import { MdOutlineVolunteerActivism } from 'react-icons/md';
import { RiTeamLine } from 'react-icons/ri';
import { LeadingActivityCard } from 'app/(company)/team/components/LeadingActivityCard';

const LEADING_ACTIVITIES = [
  {
    icon: <LuPartyPopper />,
    title: 'Candidates',
    description:
      'Good Party supports candidates in all 50 states from across the ideological spectrum. All agree to three criteria: They are neither Democrats nor Republicans, they are funded by grassroots donations, and have anti-corruption reform as a pillar of their platform.',
    linkText: 'Learn more about our campaign tools',
    href: '/run-for-office',
  },
  {
    icon: <MdOutlineVolunteerActivism />,
    title: 'Volunteers',
    description:
      'Our volunteers are the backbone of the support we provide for anti-duopoly candidates. Our 1,200 active volunteers congregate in our growing Discord and help fill critical campaign roles for candidates that lack the backing of a major political party.',
    linkText: 'Join our community',
    href: '/volunteer',
  },
  {
    icon: <RiTeamLine />,
    title: 'Good Party Team',
    description:
      'Building the tools and infrastructure powering the movement is our full-time team. We come from a diverse range of backgrounds and political persuasions, all united by the mission to make people matter more than money in our democracy.',
    linkText: 'Join our team',
    href: '/work-with-us',
  },
];
export const LeadingActivityCards = () => LEADING_ACTIVITIES
.map(
  (activity, key) => <LeadingActivityCard {...activity} key={key} />,
);
