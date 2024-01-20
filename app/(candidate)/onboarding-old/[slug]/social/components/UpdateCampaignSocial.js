'use client';

import { updateCampaign } from 'app/(candidate)/onboarding-old/shared/ajaxActions';
import { useEffect } from 'react';

export default function UpdateCampaignSocial({ campaign }) {
  useEffect(() => {
    updateCampaign({
      ...campaign,
      social: {
        completed: true,
      },
    });
  }, []);
  return <></>;
}
