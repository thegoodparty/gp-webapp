'use client';
import { useState, useEffect } from 'react';
import ContentEditor from './ContentEditor';
import useVersions from 'app/(candidate)/onboarding/shared/useVerisons';
import { fetchCampaignVersions } from 'app/(candidate)/onboarding/shared/ajaxActions';
// import { fetchUserCampaignClient } from 'helpers/campaignHelper';
import { kebabToCamel } from 'helpers/stringHelper';
import LoadingContent from './LoadingContent';

export default function EditContentPage(props) {
  const { slug, campaign } = props;
  // const [campaign, setCampaign] = useState(undefined);

  const section = kebabToCamel(slug);
  const subSectionKey = 'aiContent';

  const versions = useVersions();
  const [updatedVersions, setUpdatedVersions] = useState(false);

  const updateVersionsCallback = async () => {
    const { versions } = await fetchCampaignVersions();
    setUpdatedVersions(versions);
  };

  // const updateCampaignCallback = async () => {
  //   const campaignResp = await fetchUserCampaignClient();
  //   setCampaign(campaignResp.campaign);
  // };

  // useEffect(() => {
  //   updateCampaignCallback();
  // }, []);

  return (
    <>
      {campaign != undefined ? (
        <ContentEditor
          section={section}
          campaign={campaign}
          versions={updatedVersions || versions}
          updateVersionsCallback={updateVersionsCallback}
          subSectionKey={subSectionKey}
        />
      ) : (
        <LoadingContent
          title="Loading your content ..."
          subtitle="Please wait"
        />
      )}
    </>
  );
}
