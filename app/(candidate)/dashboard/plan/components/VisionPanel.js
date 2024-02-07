'use client';
import CampaignPlanSection from './CampaignPlanSection';

const sections = [
  {
    key: 'communicationsStrategy',
    title: 'Communication Strategy',
    icon: '/images/dashboard/strategy-icon.svg',
  },
  {
    key: 'messageBox',
    title: 'Campaign Positioning',
    icon: '/images/dashboard/positioning-icon.svg',
  },

  // {
  //   key: 'pathToVictory',
  //   title: 'Voter Report',
  //   icon: '/images/dashboard/voter-icon.svg',
  // },
  {
    key: 'mobilizing',
    title: 'Mobilizing Voters & Volunteers',
    icon: '/images/dashboard/mobilizing-icon.svg',
  },
];
export default function VisionPanel(props) {
  const { campaign, versions, updateVersionsCallback, candidatePositions } =
    props;
  const sections = [
    {
      key: 'communicationsStrategy',
      title: 'Communication Strategy',
      icon: '/images/dashboard/strategy-icon.svg',
    },
    {
      key: 'messageBox',
      title: 'Campaign Positioning',
      icon: '/images/dashboard/positioning-icon.svg',
    },

    {
      key: 'mobilizing',
      title: 'Mobilizing Voters & Volunteers',
      icon: '/images/dashboard/mobilizing-icon.svg',
    },
  ];
  if (campaign.pathToVictory) {
    sections.push({
      key: 'pathToVictory',
      title: 'Voter Report',
      icon: '/images/dashboard/voter-icon.svg',
    });
  }
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
          candidatePositions={candidatePositions}
        />
      ))}
    </div>
  );
}
