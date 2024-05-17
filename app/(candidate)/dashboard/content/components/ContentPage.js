'use client';
import { useState } from 'react';
import DashboardLayout from '../../shared/DashboardLayout';
import TitleSection from '../../shared/TitleSection';
import ContentTutorial from './ContentTutorial';
import MyContent from './MyContent';
import { getCookie } from 'helpers/cookieHelper';
import Image from 'next/image';

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
        subtitle={
          <div className="flex items-start">
            <Image
              className="mr-1 mt-0.5"
              src="/images/heart-hologram.svg"
              data-cy="logo"
              width={18}
              height={14}
              alt="GoodParty.org"
              priority
            />
            <span>
              AI can help you create high quality personalized content for your
              campaign in seconds.
            </span>
          </div>
        }
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
