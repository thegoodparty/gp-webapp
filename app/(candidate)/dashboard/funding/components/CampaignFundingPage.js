'use client';
import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';
import H4 from '@shared/typography/H4';
import ListItem from '@shared/utils/ListItem';
import { fundingFields } from 'app/(candidate)/onboarding/[slug]/finance/components/FinanceChecklist';

import DashboardLayout from '../../shared/DashboardLayout';
import TitleSection from '../../shared/TitleSection';

const tabLabels = ['Messaging', 'Social Media', 'Vision'];

export default function CampaignFundingPage(props) {
  return (
    <DashboardLayout {...props}>
      <TitleSection
        title="Funding"
        subtitle="A carefully curated checklist from our Campaign Experts to maximize your fundraising efficiency."
        image="/images/dashboard/funding.svg"
        imgWidth={128}
        imgHeight={120}
      />
      <div className="bg-gray-50 border border-slate-300 py-6 px-8 rounded-xl">
        <H3>Let&apos;s get your finances in order</H3>
        <Body2 className="mt-2">
          Setting up accounts and coming up with a plan to manage your money can
          be daunting; we get it. That&apos;s why we&apos;ve broken down the
          most important parts into easily manageable steps. Click into each
          section to get started and learn more:
        </Body2>

        {fundingFields.map((section) => (
          <div key={section.key}>
            <H3 className="mt-8 mb-7">{section.title}</H3>
            {section.steps.map((step, index) => (
              <ListItem key={step.title} title={step.title} number={index + 1}>
                <H4 className="mb-2">{section.subTitle}</H4>

                {step.description}
              </ListItem>
            ))}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
