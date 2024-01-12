'use client';
import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';
import ListItem from '@shared/utils/ListItem';
import { teamFields } from 'app/(candidate)/onboarding/[slug]/team/components/TeamList';

import DashboardLayout from '../../shared/DashboardLayout';
import TitleSection from '../../shared/TitleSection';
import InvitationSection from './InvitationSection';
import VolunteersSection from './VolunteersSection';

const tabLabels = ['Messaging', 'Social Media', 'Vision'];

export default function CampaignTeamPage(props) {
  const { volunteers } = props;
  return (
    <DashboardLayout {...props}>
      <TitleSection
        title="Campaign Team"
        subtitle="Keep in mind that in a small campaign team, individuals may take on
        multiple roles, combining responsibilities to ensure efficient use of
        resources. The specific roles and team composition will also depend on
        the campaign's unique goals, strategy, and resources."
        image="/images/dashboard/team.svg"
        imgWidth={160}
        imgHeight={120}
      />

      <InvitationSection {...props} />
      <VolunteersSection {...props} />
      <div className="bg-gray-50 border border-slate-300 py-6 px-8 rounded-xl">
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
