import Paper from '@shared/utils/Paper';
import VolunteerDashboardLayout from '../shared/VolunteerDashboardLayout';
import H2 from '@shared/typography/H2';
import Body1 from '@shared/typography/Body1';
import AnimationSection from './AnimationSection';
import { Fragment } from 'react';
import Body2 from '@shared/typography/Body2';
import Link from 'next/link';
import PrimaryButton from '@shared/buttons/PrimaryButton';

export default function VolunteerDashboardPage(props) {
  const { campaigns } = props;
  console.log('campaigns', campaigns);
  return (
    <VolunteerDashboardLayout {...props}>
      <Paper className=" mt-6 md:py-12 md:px-6 flex flex-col items-center">
        <div className="w-64 h-64">
          <AnimationSection />
        </div>
        <H2>Welcome to your volunteer dashboard.</H2>
        <Body1 className="mt-2">
          You are volunteering to help with the campaign
          {campaigns.length > 1 ? 's' : ''}:
        </Body1>
        {campaigns.map((campaign) => (
          <div
            key={campaign.slug}
            className="mt-6 py-4 px-12 rounded border border-slate-300 text-center bg-gray-200"
          >
            <Body1>
              <strong>
                {campaign.firstName} {campaign.lastName}
              </strong>
            </Body1>
            <Body1 className="mt-2">
              Running for{' '}
              {campaign.office === 'Other'
                ? campaign.otherOffice
                : campaign.office}
            </Body1>
          </div>
        ))}
        <div className="mt-12 mb-16">
          <Link href="/volunteer-dashboard/door-knocking">
            <PrimaryButton>Door Knocking Campaigns</PrimaryButton>
          </Link>
        </div>
      </Paper>
    </VolunteerDashboardLayout>
  );
}
