// import H3 from '@shared/typography/H3';
// import ListItem from '@shared/utils/ListItem';
import DashboardLayout from '../../shared/DashboardLayout';
// import TitleSection from '../../shared/TitleSection';
// import { getServerUser } from 'helpers/userServerHelper';
import TeamSection from './TeamSection';

const teamFields = [
  {
    title: 'Essential roles:',
    steps: [
      {
        title: 'Campaign Treasurer / Compliance Manager',
        description:
          'Develops and oversees the campaign budget, fundraising strategies, and ensures compliance with financial regulations.',
      },
      {
        title: 'Campaign Manager',
        description:
          'Oversees the entire campaign, manages day-to-day operations, and ensures that the campaign stays on track to achieve its goals.',
      },
      {
        title: 'Communications Director',
        description:
          'Manages all aspects of campaign messaging, including public relations, speeches, press releases, and digital communications.',
      },
      {
        title: 'Field Director',
        description:
          'Organizes and manages grassroots efforts such as voter outreach, door-to-door canvassing, and volunteer recruitment.',
      },
    ],
  },
  {
    title: 'Nice to have roles:',
    steps: [
      {
        title: 'Data Analyst',
        description:
          'Tracks and analyzes campaign data to optimize voter outreach and engagement.',
      },
      {
        title: 'Policy Advisor',
        description:
          'Assists the candidate with developing policy positions and helps craft messaging around those positions.',
      },
      {
        title: 'Graphic Designer',
        description:
          'Creates visual materials for the campaign, such as logos, flyers, and social media content.',
      },
      {
        title: 'Videographer',
        description:
          'Produces and edits videos for campaign advertisements, social media, and events.',
      },
      {
        title: 'Event Planner',
        description:
          'Organizes campaign events, including rallies, town halls, and fundraisers.',
      },
      {
        title: 'Social Media Manager',
        description:
          "Manages the campaign's social media presence, creating engaging content and monitoring online conversations.",
      },
      {
        title: 'Direct Mail Coordinator',
        description:
          "Develops and manages the campaign's direct mail strategy, including targeting, messaging, and design.",
      },
      {
        title: 'Constituency Outreach Coordinator',
        description:
          'Identifies and engages with key demographic groups and communities to build support for the campaign.',
      },
      {
        title: 'Research Director',
        description:
          'Gathers and analyzes data on the candidate, the opposition, and the electorate to inform campaign strategy.',
      },
      {
        title: 'Digital Director',
        description:
          "Oversees the campaign's online presence, including the website, social media, and digital advertising efforts.",
      },
      {
        title: 'Scheduler',
        description:
          "Manages the candidate's time, coordinates appearances, and ensures efficient use of resources.",
      },
      {
        title: 'Volunteer Coordinator',
        description:
          'Recruits, trains, and manages volunteers to support various campaign activities.',
      },
    ],
  },
];

export default function CampaignTeamPage(props) {
  return (
    <DashboardLayout {...props}>
      <TeamSection {...props} />
    </DashboardLayout>
  );
}
