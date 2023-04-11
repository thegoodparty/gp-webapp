import BlackButton from '@shared/buttons/BlackButton';
import { Fragment } from 'react';
import CampaignPlanSection from './CampaignPlanSection';
import LockedCampaignPlanSection from './LockedCampaignPlanSection';

const sections = [
  { key: 'slogan', title: 'Slogans' },
  { key: 'why', title: "Why I'm Running" },
  { key: 'aboutMe', title: 'About Me' },
  { key: 'policyPlatform', title: 'Policy Platform' },
  { key: 'messageBox', title: 'Message Box' },
  { key: 'communicationsStrategy', title: 'Communications Strategy' },
];

const lockedSections = [
  { key: 'pathToVictory', title: 'Path To Victory' },
  { key: 'mobilizing', title: 'Mobilizing voters and volunteers' },
  { key: 'getOutTheVote', title: 'Get out the vote tactics' },
  { key: 'timeline', title: 'Timeline' },
];
export default function CampaignPlanSections({ campaign }) {
  const isWhyLocked = !campaign.pathToVictory;
  return (
    <>
      <h2 className="my-8 text-3xl font-black">WHY</h2>
      {sections.map((section) => (
        <CampaignPlanSection
          key={section.key}
          section={section}
          campaign={campaign}
          initialOpen={section.key === 'slogan'}
        />
      ))}

      <h2 className="mb-8 mt-16 text-3xl font-black">HOW</h2>
      {isWhyLocked && (
        <div className="mb-8 text-xl font-black">
          Our team is working on your campaign materials now. This can take up
          to 48 hours. In the meantime, check out your campaign resources below.
        </div>
      )}
      {lockedSections.map((section) => (
        <Fragment key={section.key}>
          {isWhyLocked ? (
            <LockedCampaignPlanSection key={section.key} section={section} />
          ) : (
            <CampaignPlanSection
              key={section.key}
              section={section}
              campaign={campaign}
              initialOpen={section.key === 'pathToVictory'}
            />
          )}
        </Fragment>
      ))}
      <div className="text-center mt-8 font-black">
        <a href={`/onboarding/${campaign.slug}/dashboard/1`}>
          <BlackButton>CONTINUE</BlackButton>
        </a>
      </div>
    </>
  );
}
