import BlackButton from '@shared/buttons/BlackButton';
import CampaignPlanSection from './CampaignPlanSection';

const sections = [
  { key: 'slogan', title: 'Slogans' },
  { key: 'policyPlatform', title: 'Policy Platform' },
  { key: 'pathToVictory', title: 'Path To Victory' },
  { key: 'communicationsStrategy', title: 'Communications Strategy' },
  { key: 'mobilizing', title: 'Mobilizing voters and volunteers' },
  { key: 'getOutTheVote', title: 'Get out the vote tactics' },
  { key: 'operationalPlan', title: 'Operational plan' },
  { key: 'timeline', title: 'Timeline' },
];
export default function CampaignPlanSections({ campaign }) {
  return (
    <>
      {sections.map((section) => (
        <CampaignPlanSection
          key={section.key}
          section={section}
          campaign={campaign}
          initialOpen={section.key === 'slogan'}
        />
      ))}
      <div className="text-center mt-8 font-black">
        <a href={`/onboarding/${campaign.slug}/dashboard/1`}>
          <BlackButton>CONTINUE</BlackButton>
        </a>
      </div>
    </>
  );
}
