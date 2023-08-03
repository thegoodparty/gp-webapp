'use client';
import { useState } from 'react';
import ContentEditor from './ContentEditor';
import useVersions from 'app/(candidate)/onboarding/shared/useVerisons';
import { fetchCampaignVersions } from 'app/(candidate)/onboarding/shared/ajaxActions';

export default function EditContentPage(props) {

  const {slug, campaign, prompts} = props; 

  console.log("slug: ", slug);

//   const key = section;
//   const key = slug; 
  const key = 'socialMediaCopy';
  const subSectionKey = 'aiContent';

  const campaignPlan = campaign[subSectionKey];

  const versions = useVersions();
  const [updatedVersions, setUpdatedVersions] = useState(false);

  const updateVersionsCallback = async () => {
    const { versions } = await fetchCampaignVersions();
    setUpdatedVersions(versions);
  };

  
  return (
    // <DashboardLayout {...props}>

    <>
        <ContentEditor
          key={slug}
          section={"socialMediaCopy"}
          campaign={campaign}
          versions={updatedVersions || versions}
          updateVersionsCallback={updateVersionsCallback}
          subSectionKey={subSectionKey}
        />

    </>
    );
}
