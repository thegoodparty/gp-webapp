'use client';
import CampaignPlanSection from 'app/(candidate)/onboarding/[slug]/campaign-plan/components/CampaignPlanSection';

const sections = [
  {
    key: 'slogan',
    title: 'Slogans',
    icon: '/images/dashboard/slogan-icon.svg',
  },
  {
    key: 'messageBox',
    title: 'Campaign Positioning',
    icon: '/images/dashboard/positioning-icon.svg',
  },
  {
    key: 'communicationsStrategy',
    title: 'Communication Strategy',
    icon: '/images/dashboard/strategy-icon.svg',
  },
  {
    key: 'policyPlatform',
    title: 'My Policies',
    icon: '/images/dashboard/policies-icon.svg',
  },
];
export default function MessagingPanel(props) {
  const { campaign, versions, updateVersionsCallback } = props;
  return (
    <div>
      {sections.map((section) => (
        <CampaignPlanSection
          key={section.key}
          section={section}
          campaign={campaign}
          //   versions={updatedVersions || versions}
          versions={versions}
          updateVersionsCallback={updateVersionsCallback}
        />
      ))}
    </div>
  );
}
