import BlackButton from '@shared/buttons/BlackButton';
import { fetchCampaignVersions } from 'app/(candidate)/onboarding/shared/ajaxActions';
import useVersions from 'app/(candidate)/onboarding/shared/useVerisons';
import { Fragment, useEffect, useState } from 'react';
import { FaLock } from 'react-icons/fa';
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
  { key: 'operationalPlan', title: 'Budget' },
  { key: 'timeline', title: 'Timeline' },
];
export default function CampaignPlanSections({ campaign }) {
  const versions = useVersions();
  const [updatedVersions, setUpdatedVersions] = useState(false);
  const isWhyLocked = !campaign.pathToVictory;

  const updateVersionsCallback = async () => {
    const { versions } = await fetchCampaignVersions();
    setUpdatedVersions(versions);
  };
  return (
    <>
      <h2 className="my-8 text-3xl font-black">WHY</h2>
      {sections.map((section) => (
        <CampaignPlanSection
          key={section.key}
          section={section}
          campaign={campaign}
          initialOpen={section.key === 'slogan'}
          versions={updatedVersions || versions}
          updateVersionsCallback={updateVersionsCallback}
        />
      ))}

      <h2 className="mb-8 mt-16 text-3xl font-black">HOW</h2>
      <div className="relative">
        {lockedSections.map((section) => (
          <Fragment key={section.key}>
            {isWhyLocked ? (
              <LockedCampaignPlanSection section={section} />
            ) : (
              <CampaignPlanSection
                key={section.key}
                section={section}
                campaign={campaign}
                initialOpen={section.key === 'pathToVictory'}
                versions={updatedVersions || versions}
                updateVersionsCallback={updateVersionsCallback}
              />
            )}
          </Fragment>
        ))}
        {isWhyLocked && (
          <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
            <div className="flex max-w-[550px] bg-white p-10 lg:p-16 rounded-2xl shadow-xl items-center">
              <div>
                <FaLock size={80} className="text-gray-400" />
              </div>
              <div className="pl-10 text-xl font-black">
                Our team is working on your campaign materials now. This can
                take up to 48 hours. In the meantime, check out your campaign
                resources below.
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-center mt-8 font-black">
        <a href={`/onboarding/${campaign.slug}/dashboard`}>
          <BlackButton>CONTINUE</BlackButton>
        </a>
      </div>
    </>
  );
}
