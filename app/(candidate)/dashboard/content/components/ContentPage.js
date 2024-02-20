'use client';
import { useState } from 'react';
import DashboardLayout from '../../shared/DashboardLayout';
import TitleSection from '../../shared/TitleSection';
import ContentTutorial from './ContentTutorial';
import MyContent from './MyContent';
import { getCookie } from 'helpers/cookieHelper';

export default function ContentPage(props) {
  const [forceOpenModal, setForceOpenModal] = useState(false);
  const newContentCallback = () => {
    setForceOpenModal(true);
  };
  const cookie = getCookie('tutorial-content');
  const shouldShowTutorial = !cookie && !props.campaign?.aiContent;
  return (
    <DashboardLayout {...props}>
      <TitleSection
        title="My Content"
        subtitle="Good Party GPT can help you create high quality content for your campaign"
        image="/images/dashboard/content.svg"
        imgWidth={120}
        imgHeight={120}
      />
      <MyContent {...props} forceOpenModal={forceOpenModal} />
      {shouldShowTutorial && (
        <ContentTutorial newContentCallback={newContentCallback} />
      )}
    </DashboardLayout>
  );
}
