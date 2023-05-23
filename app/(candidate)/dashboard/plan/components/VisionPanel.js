'use client';
import CampaignPlanSection from 'app/(candidate)/onboarding/[slug]/campaign-plan/components/CampaignPlanSection';

const sections = [
  {
    key: 'why',
    title: "Why I'm Running",
    icon: '/images/dashboard/running-icon.svg',
  },
  {
    key: 'aboutMe',
    title: 'My Persona',
    icon: '/images/dashboard/persona-icon.svg',
  },
  {
    key: 'pathToVictory',
    title: 'Voter Report',
    icon: '/images/dashboard/voter-icon.svg',
  },
  {
    key: 'mobilizing',
    title: 'Mobilizing voters & volunteers',
    icon: '/images/dashboard/mobilizing-icon.svg',
  },
];
export default function VisionPanel(props) {
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
