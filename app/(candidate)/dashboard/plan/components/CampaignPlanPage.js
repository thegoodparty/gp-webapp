'use client';
import Tabs from '@shared/utils/Tabs';
import { fetchCampaignVersions } from 'app/(candidate)/onboarding/shared/ajaxActions';
import useVersions from 'app/(candidate)/onboarding/shared/useVerisons';
import { useState } from 'react';
import DashboardLayout from '../../shared/DashboardLayout';
import TitleSection from '../../shared/TitleSection';
import MessagingPanel from './MessagingPanel';
import SocialPanel from './SocialPanel';
import VisionPanel from './VisionPanel';

const tabLabels = ['Messaging', 'Social Media', 'Vision'];

export default function CampaignPlanPage(props) {
  const versions = useVersions();
  const [updatedVersions, setUpdatedVersions] = useState(false);

  const updateVersionsCallback = async () => {
    const { versions } = await fetchCampaignVersions();
    setUpdatedVersions(versions);
  };
  const tabPanels = [
    <MessagingPanel
      key="messagingPanel"
      {...props}
      versions={updatedVersions || versions}
      updateVersionsCallback={updateVersionsCallback}
    />,
    <SocialPanel key="socialMediaPanel" {...props} />,
    <VisionPanel
      key="visionPanel"
      {...props}
      versions={updatedVersions || versions}
      updateVersionsCallback={updateVersionsCallback}
    />,
  ];
  return (
    <DashboardLayout {...props}>
      <TitleSection
        title="Campaign Plan"
        subtitle="Your personalized plan powered by Good Party GPT and our team of campaign experts"
        image="/images/dashboard/plan.svg"
        imgWidth={132}
        imgHeight={120}
      />
      <Tabs tabLabels={tabLabels} tabPanels={tabPanels} />
    </DashboardLayout>
  );
}
