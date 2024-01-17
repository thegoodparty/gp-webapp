'use client';

import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { useEffect } from 'react';

export default function UpdateCampaignTeam({ campaign }) {
  useEffect(() => {
    updateCampaign({
      ...campaign,
      team: {
        completed: true,
      },
    });
  }, []);
  return <></>;
}
