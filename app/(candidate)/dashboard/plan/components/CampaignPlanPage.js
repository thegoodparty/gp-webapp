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

export default function CampaignPlanPage(props) {
  const versions = useVersions();
  const [updatedVersions, setUpdatedVersions] = useState(false);

  const updateVersionsCallback = async () => {
    const { versions } = await fetchCampaignVersions();
    setUpdatedVersions(versions);
  };

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
      />

      <H3 className="mt-5 mb-3">Vision</H3>
      <VisionPanel
        {...props}
        versions={updatedVersions || versions}
        updateVersionsCallback={updateVersionsCallback}
      />
    </DashboardLayout>
  );
}
