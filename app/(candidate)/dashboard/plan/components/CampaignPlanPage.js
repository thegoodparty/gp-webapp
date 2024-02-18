'use client';
import { fetchCampaignVersions } from 'app/(candidate)/onboarding/shared/ajaxActions';
import useVersions from 'app/(candidate)/onboarding/shared/useVerisons';
import { useState } from 'react';
import DashboardLayout from '../../shared/DashboardLayout';
import TitleSection from '../../shared/TitleSection';
import MessagingPanel from './MessagingPanel';
import VisionPanel from './VisionPanel';
import H3 from '@shared/typography/H3';
import QuestionProgress from './QuestionProgress';
import PlanTutorial from './PlanTutorial';
import { getCookie } from 'helpers/cookieHelper';

export default function CampaignPlanPage(props) {
  const versions = useVersions();
  const [updatedVersions, setUpdatedVersions] = useState(false);
  const [expandKey, setExpandKey] = useState(false);
  const cookie = getCookie('tutorial-plan');

  const updateVersionsCallback = async () => {
    const { versions } = await fetchCampaignVersions();
    setUpdatedVersions(versions);
  };

  const expandKeyCallback = (key) => {
    setExpandKey(key);
  };
  const shouldShowTutorial = !cookie && !props.campaign?.campaignPlan;

  return (
    <DashboardLayout {...props}>
      <TitleSection
        title="AI Campaign Plan"
        subtitle="Your personalized plan powered by Good Party GPT and our team of campaign experts"
        image="/images/dashboard/plan.svg"
        imgWidth={132}
        imgHeight={120}
      />
      <QuestionProgress {...props} />
      <H3 className="mt-5 mb-3">Messaging</H3>
      <MessagingPanel
        {...props}
        versions={updatedVersions || versions}
        updateVersionsCallback={updateVersionsCallback}
        expandSection={expandKey}
      />

      <H3 className="mt-5 mb-3">Vision</H3>
      <VisionPanel
        {...props}
        versions={updatedVersions || versions}
        updateVersionsCallback={updateVersionsCallback}
      />
      {shouldShowTutorial && (
        <PlanTutorial expandKeyCallback={expandKeyCallback} />
      )}
    </DashboardLayout>
  );
}
