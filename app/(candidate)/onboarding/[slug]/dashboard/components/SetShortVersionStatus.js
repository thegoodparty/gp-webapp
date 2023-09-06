'use client';

import { useEffect } from 'react';
import { launchCampaign } from '../../launch/components/LaunchChecklist';

export default function SetShortVersionStatus(props) {
  const { campaign } = props;
  useEffect(() => {
    if (campaign) {
      checkShortVersionLaunchStatus();
    }
  }, [campaign]);

  const checkShortVersionLaunchStatus = async () => {
    // if the user is in the short version and completed step 4 (website),
    // and the campaign is not marked as pending - set it as pending
    const shortVersion = !!campaign.details?.filedStatement;
    if (
      shortVersion &&
      campaign.profile?.campaignWebsite &&
      campaign.launchStatus !== 'launched' &&
      campaign.launchStatus !== 'pending'
    ) {
      await launchCampaign();
      window.location.reload();
    }
  };
  return null;
}
