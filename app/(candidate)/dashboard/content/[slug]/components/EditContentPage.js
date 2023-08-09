'use client';
import { useState } from 'react';
import ContentEditor from './ContentEditor';
import useVersions from 'app/(candidate)/onboarding/shared/useVerisons';
import { fetchCampaignVersions } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { kebabToCamel } from 'helpers/stringHelper';

export default function EditContentPage(props) {
  const { slug, campaign } = props;

  const section = kebabToCamel(slug);
  const subSectionKey = 'aiContent';

  const versions = useVersions();
  const [updatedVersions, setUpdatedVersions] = useState(false);

  const updateVersionsCallback = async () => {
    const { versions } = await fetchCampaignVersions();
    setUpdatedVersions(versions);
  };

  return (
    <>
      <ContentEditor
        section={section}
        campaign={campaign}
        versions={updatedVersions || versions}
        updateVersionsCallback={updateVersionsCallback}
        subSectionKey={subSectionKey}
      />
    </>
  );
}
