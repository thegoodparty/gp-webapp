'use client';
import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';
import H4 from '@shared/typography/H4';
import ListItem from '@shared/utils/ListItem';

import DashboardLayout from '../../../shared/DashboardLayout';
import TitleSection from '../../../shared/TitleSection';
import NoCampaign from './NoCampaign';
import H1 from '@shared/typography/H1';
import Body1 from '@shared/typography/Body1';
import Link from 'next/link';
import { dateUsHelper } from 'helpers/dateHelper';

const fundingFields = [
  {
    key: 'ein',
    title: 'File for an EIN with the IRS',
    subTitle: 'To file for an EIN with the IRS, follow these steps:',
    steps: [
      {
        title: "Determine your campaign's legal structure:",
        description:
          'Your campaign may be set up as a sole proprietorship, partnership, corporation, or another type of legal entity. Consult with a legal or tax professional to determine the most appropriate structure for your campaign.',
      },
      {
        title: 'Visit the IRS website:',
        description: (
          <>
            Go to the IRS EIN Assistant (
            <a
              href="https://www.irs.gov/ein"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="font-medium underline"
            >
              https://www.irs.gov/ein
            </a>
            ) to start the online EIN application process. The application is
            available Monday through Friday, 7 a.m. to 10 p.m. Eastern Time.
          </>
        ),
      },
      {
        title: 'Complete the online application:',
        description:
          "Fill out the required information, including your campaign's legal structure, personal information, and contact details. You'll also need to provide the reason for applying for an EIN, such as starting a new campaign or hiring employees.",
      },
      {
        title: 'Review and submit the application:',
        description:
          'Double-check your application for accuracy before submitting it. If your application is complete and error-free, you will receive your EIN immediately after submission.',
      },
      {
        title: 'Keep a record of your EIN:',
        description:
          'Once you have your EIN, store it in a secure location and use it for all future financial and tax-related activities related to your campaign.',
      },
    ],
  },
  {
    key: 'management',
    title: 'Financial management',
    subTitle: 'Open your account(s), accept donations',
    steps: [
      {
        title: 'Open a campaign checking account',
        description:
          'This should be separate from your personal financial account(s).',
      },
      {
        title: 'Open a payment processor account for online fundraising',
        description: 'Try Stripe or Anedot',
      },
      {
        title: 'Embed a donate button into your website',
        description: '',
      },
    ],
  },
  {
    key: 'regulatory',
    title:
      'Research and file necessary paperwork with relevant campaign regulatory agency',
    subTitle:
      'Crucial for establishing your campaign as a legal entity and ensuring compliance with federal, state, and local campaign finance laws',
    steps: [
      {
        title: 'Determine the relevant regulatory agency:',
        description:
          'Identify the agency responsible for overseeing campaign finance laws and regulations for the office you are seeking. This may vary based on whether you are running for federal, state, or local office.',
      },
      {
        title: 'Research filing requirements:',
        description:
          "Visit the official website of the relevant regulatory agency to review the filing requirements and deadlines for your campaign. This may include registering your campaign, filing a statement of candidacy, designating a campaign committee, or disclosing your campaign's financial activity.",
      },
      {
        title: 'Familiarize yourself with campaign finance laws:',
        description:
          'Study the campaign finance laws and regulations that apply to your campaign, including contribution limits, disclosure requirements, and reporting deadlines. It is crucial to have a clear understanding of these laws to avoid any potential legal issues.',
      },
      {
        title: 'Prepare the required paperwork:',
        description:
          'Based on the information gathered in steps 2 and 3, compile the necessary forms and documents required by the relevant regulatory agency. Ensure that all information provided is accurate, complete, and up-to-date.',
      },
      {
        title: 'Consult with a legal or compliance expert:',
        description:
          'Consider seeking guidance from a legal or compliance expert familiar with campaign finance laws and regulations. They can help review your paperwork and advise on any necessary adjustments to ensure compliance.',
      },
      {
        title: 'File the paperwork:',
        description:
          "Submit the required paperwork to the appropriate campaign regulatory agency by the specified deadline. Keep copies of all submitted documents and track your filing status through the agency's online portal or by contacting the agency directly.",
      },
      {
        title: 'Stay informed and up-to-date:',
        description:
          'Continuously monitor any changes to campaign finance laws and regulations that may impact your campaign. Update and submit any additional paperwork as needed to maintain compliance with these evolving requirements.',
      },
    ],
  },
  {
    key: 'filing',
    title: 'Identify and mark down key campaign filing and finance deadlines',
    subTitle:
      "Manage your campaign's financial activities more effectively, maintain transparency, and avoid potential legal issues",
    steps: [
      {
        title: 'Determine the relevant regulatory agencies:',
        description:
          'Identify the agencies responsible for overseeing campaign finance laws and regulations for the office you are seeking. This may vary based on whether you are running for federal, state, or local office.',
      },
      {
        title: 'Research filing and finance deadlines:',
        description:
          "Visit the official websites of the relevant regulatory agencies to find information on key deadlines, such as registering your campaign, filing financial reports, disclosing contributions, and submitting other required paperwork. Be aware that deadlines may vary depending on the election cycle, the office you are seeking, and your campaign's specific circumstances.",
      },
      {
        title: 'Create a comprehensive calendar:',
        description:
          'Compile all identified deadlines into a single, comprehensive calendar. This can be a physical calendar, a digital calendar, or a project management tool that allows you to set reminders and notifications for upcoming deadlines.',
      },
      {
        title: 'Prioritize deadlines:',
        description:
          'Some deadlines are more critical than others, so prioritize them accordingly. For example, deadlines related to candidate registration or financial disclosures may carry greater consequences if missed, so ensure these are clearly marked and given priority.',
      },
      {
        title: 'Assign responsibilities:',
        description:
          'Delegate tasks related to meeting filing and finance deadlines to your campaign treasurer, compliance manager, or other team members as appropriate. Make sure everyone is aware of their responsibilities and the importance of meeting these deadlines.',
      },
      {
        title: 'Set reminders and notifications:',
        description:
          'Use your calendar or project management tool to set up reminders and notifications for all key deadlines. These should be scheduled well in advance to give your team enough time to prepare and submit the necessary paperwork.',
      },
      {
        title: 'Monitor and update deadlines:',
        description:
          'Continuously monitor any changes in filing and finance deadlines that may impact your campaign. Update your calendar accordingly and communicate any changes to your team members.',
      },
      {
        title: 'Conduct regular check-ins:',
        description:
          'Hold regular check-ins with your team members responsible for meeting deadlines to ensure progress is being made and any issues or concerns are addressed promptly.',
      },
    ],
  },
];

export default function DoorKnockingMainPage(props) {
  const { dkCampaigns } = props;
  return (
    <DashboardLayout {...props}>
      {!dkCampaigns || dkCampaigns.length === 0 ? (
        <NoCampaign />
      ) : (
        <div className="bg-gray-50 border border-slate-300 py-6 px-8 rounded-xl min-h-[calc(100vh-75px)]">
          <H1>Existing Campaigns</H1>
          <div className="mt-6 grid grid-cols-12 gap-4">
            {dkCampaigns.map((campaign) => (
              <Link
                href={`/dashboard/door-knocking/campaign/${campaign.slug}`}
                key={campaign.slug}
                className="col-span-12 md:col-span-6 lg:col-span-4 no-underline"
              >
                <div className=" bg-white border transition-colors border-slate-300 p-4 rounded-md shadow hover:border-primary cursor-pointer">
                  <H3 className="mb-3">{campaign.name}</H3>
                  <Body1>
                    {dateUsHelper(campaign.startDate)} -{' '}
                    {dateUsHelper(campaign.endDate)}
                    <br />
                    {campaign.housesPerRoute} houses per route
                    <br />
                    {campaign.minutesPerHouse} minutes at each house
                  </Body1>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
