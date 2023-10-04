'use client';
import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';
import ListItem from '@shared/utils/ListItem';
import { teamFields } from 'app/(candidate)/onboarding/[slug]/team/components/TeamList';

import DashboardLayout from '../../shared/DashboardLayout';
import TitleSection from '../../shared/TitleSection';

const tabLabels = ['Messaging', 'Social Media', 'Vision'];

export default function CampaignTeamPage(props) {
  return (
    <DashboardLayout {...props}>
      <TitleSection
        title="Campaign Team"
        subtitle="Good Party AI can help you create high quality content for your campaign"
        image="/images/dashboard/team.svg"
        imgWidth={160}
        imgHeight={120}
      />
      <div className="bg-gray-50 border border-slate-300 py-6 px-8 rounded-xl">
        <H3>Things to consider:</H3>
        <Body2 className="mt-2">
          Keep in mind that in a small campaign team, individuals may take on
          multiple roles, combining responsibilities to ensure efficient use of
          resources. The specific roles and team composition will also depend on
          the campaign&apos;s unique goals, strategy, and resources.
        </Body2>

        {teamFields.map((section) => (
          <div key={section.title}>
            <H3 className="mt-8 mb-7">{section.title}</H3>
            {section.steps.map((step, index) => (
              <ListItem key={step.title} title={step.title} number={index + 1}>
                {step.description}
              </ListItem>
            ))}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
