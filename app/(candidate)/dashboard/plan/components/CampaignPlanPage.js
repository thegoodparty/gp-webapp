'use client';
import Tabs from '@shared/utils/Tabs';
import { fetchCampaignVersions } from 'app/(candidate)/onboarding/shared/ajaxActions';
import useVersions from 'app/(candidate)/onboarding/shared/useVerisons';
import { useState } from 'react';
import DashboardLayout from '../../shared/DashboardLayout';
import MessagingPanel from './MessagingPanel';
import SocialPanel from './SocialPanel';
import TitleSection from './TitleSection';

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
    <MessagingPanel key="visionPanel" {...props} />,
  ];
  return (
    <DashboardLayout {...props}>
      <TitleSection />
      <Tabs tabLabels={tabLabels} tabPanels={tabPanels} />
    </DashboardLayout>
  );
}
