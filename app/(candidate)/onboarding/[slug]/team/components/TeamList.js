import YellowButton from '@shared/buttons/YellowButton';
import { Fragment } from 'react';

const fields = [
  {
    title: 'ESSENTIAL RESPONSIBILITIES',
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
    title: 'NICE-TO-HAVE ROLES',
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
export default function TeamList({ slug }) {
  return (
    <>
      <div className="lg:mt-6 pt-5 lg:pt-10 bg-white rounded-2xl">
        <div>
          <div class="font-bold mb-10 text-2xl px-6 lg:px-10">
            Things to consider when building a team:
          </div>
          <div className="text-lg max-w-3xl font-light px-6 lg:px-10">
            Keep in mind that in a small campaign team, individuals may take on
            multiple roles, combining responsibilities to ensure efficient use
            of resources. The specific roles and team composition will also
            depend on the campaign&apos;s unique goals, strategy, and resources.
          </div>
        </div>
        {fields.map((field) => (
          <div key={field.title} className="pt-14 lg:pt-28">
            <h2 className="text-2xl font-black pb-4 pl-6 lg:pl-20">
              {field.title}
            </h2>
            <div className="bg-slate-100 h-1" />
            {field.steps.map((step, index) => (
              <Fragment key={step.title}>
                <div className="py-6 flex items-center">
                  <div className="text-right lg:text-center w-16 shrink-0 lg:w-[180px] font-bold text-5xl lg:text-6xl">
                    {index + 1}
                  </div>
                  <div className="hidden lg:block bg-slate-100 w-1 h-10 mr-14 shrink-0"></div>
                  <div>
                    <h3 className="font-bold text-lg lg:text-2xl mb-1 ml-4 lg:ml-0">
                      {step.title}
                    </h3>
                    <div className="text-sm lg:text-lg font-light ml-4 lg:ml-0">
                      {step.description}
                    </div>
                  </div>
                </div>
                <div className="bg-slate-100 h-1" />
              </Fragment>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <a href={`/onboarding/${slug}/dashboard`}>
          <YellowButton>CONTINUE</YellowButton>
        </a>
      </div>
    </>
  );
}
