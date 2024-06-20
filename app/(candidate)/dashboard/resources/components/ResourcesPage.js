'use client';
import H5 from '@shared/typography/H5';

import DashboardLayout from '../../shared/DashboardLayout';
import TitleSection from '../../shared/TitleSection';
import ResourceWrapper from './ResourcesWrapper';

const sections = [
  {
    title: 'Campaign Messaging Strategy',
    fields: [
      {
        type: 'blog',
        slug: 'best-practices-for-crafting-a-winning-message',
      },
    ],
  },

  {
    title: 'Build a Campaign Team',
    fields: [
      {
        type: 'file',
        title: 'Endorsement Checklist',
        description:
          'Comprehensive checklist ensuring thorough assessment of political endorsements and candidate support.',
        file: 'https://docs.google.com/document/d/1NeREKkd2HfFcrllQbAryy5Cn5FBabtfNsxI-ircv_b4/edit',
      },
      {
        type: 'file',
        title: 'Sample Endorsement Pitch',
        description:
          'Example of a persuasive, well-structured pitch for securing endorsements in various contexts',
        file: 'https://docs.google.com/document/d/1Zx_WbrjQogr8ftar2PInxfXuYPvhMFBLwxZ8TTHvc3Y/edit',
      },
      {
        type: 'file',
        title: 'Sample Asks of Endorsers',
        description:
          'Examples of requests and expectations for endorsers in political, business, or social contexts.',
        file: 'https://docs.google.com/document/d/1z0K6n5jhxtrYc-TpXnZBUgGGHrwEhrq68ZS1OqEX-54/edit',
      },

      {
        type: 'blog',
        slug: 'how-to-build-and-manage-an-effective-volunteer-team',
      },
      {
        type: 'file',
        title: 'Volunteer Checklist',
        description:
          'Essential tasks and reminders for effective volunteer engagement and orientation in organizations.',
        file: 'https://docs.google.com/document/d/16xDjKGHKH8vR80ZELw9QSyW-utu9y6ZFqQa13IAWllU/edit',
      },
      {
        type: 'file',
        title: 'Sample Volunteer Sign Up Form',
        description:
          'A useful tool for campaigns to efficiently and effectively collect information from potential volunteers.',
        file: 'https://docs.google.com/document/d/11yUOHQC8KP2O00dx06oJOrPQZ39C2-WWoxhIDaEiJP4/edit',
      },
      {
        type: 'file',
        title: 'Sample Volunteer Manual',
        description:
          'Comprehensive guide for volunteers, detailing roles, expectations, and best practices in various organizations.',
        file: 'https://docs.google.com/document/d/1eQ04zEURkCg8retajR03hn8CQSetTfE-rZZKz8u-hYg/edit',
      },
    ],
  },
  {
    title: 'Social Media Resources',
    fields: [
      {
        type: 'blog',
        slug: 'mastering-social-media-content-for-your-campaign',
      },
      {
        type: 'blog',
        slug: 'getting-verified-to-run-political-ads-on-facebook',
      },
      {
        type: 'blog',
        slug: 'creating-content-to-generate-fundraising-and-volunteers',
      },
    ],
  },
  {
    title: 'Fundraising',
    fields: [
      {
        type: 'blog',
        slug: 'raising-the-bar-best-practices-for-political-fundraising',
      },
      {
        type: 'file',
        title: 'Sample Finance Plan',
        description:
          'Template to help you plan, execute, and evaluate your fundraising efforts.',
        file: 'https://docs.google.com/document/d/1UAm-N9nU4JuD-0yaMkQBepFu90bnmyzUQX2wd-BtLLc/edit?usp=sharing',
      },
    ],
  },
  {
    title: 'Voter Outreach & Engagement',
    fields: [
      {
        type: 'blog',
        slug: 'from-ideation-to-inauguration-a-political-campaign-goal-timeline',
      },
    ],
  },
];
export default function ResourcesPage(props) {
  return (
    <DashboardLayout {...props}>
      <TitleSection
        title="Resource Library"
        subtitle="A carefully curated library of the most proven resources to help you become a viable candidate"
        image="/images/dashboard/resources.svg"
        imgWidth={128}
        imgHeight={120}
      />

      <div className="mt-14 mb-8 ">
        {sections.map((section) => (
          <div key={section.title}>
            <H5 className="mt-9 mb-3">{section.title}</H5>
            <div className="mt-2 grid grid-cols-12 gap-3 items-stretch">
              {section.fields.map((field) => (
                <div
                  key={field.title || field.slug}
                  className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 h-full"
                >
                  <ResourceWrapper resource={field} {...props} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
