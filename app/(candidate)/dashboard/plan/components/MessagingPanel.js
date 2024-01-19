'use client';
import CampaignPlanSection from './CampaignPlanSection';
import CampaignWebsite from './CampaignWebsite';

const sections = [
  {
    key: 'why',
    title: "Why I'm Running",
    icon: '/images/dashboard/running-icon.svg',
  },
  {
    key: 'aboutMe',
    title: 'Bio',
    icon: '/images/dashboard/persona-icon.svg',
  },
  {
    key: 'slogan',
    title: 'Campaign Slogan',
    icon: '/images/dashboard/slogan-icon.svg',
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
      <CampaignWebsite {...props} />
    </div>
  );
}
