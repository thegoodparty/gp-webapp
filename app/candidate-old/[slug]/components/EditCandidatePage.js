'use client';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { useEffect, useState } from 'react';
import CandidatePage from './CandidatePage';

export function debounce(func, args, timeout = 600) {
  clearTimeout(window.timer);
  window.timer = setTimeout(() => {
    func(args);
  }, timeout);
}

export default function EditCandidatePage(props) {
  const { candidate, campaign } = props;
  const [color, setColor] = useState(candidate.color || '#734BDC');
  useEffect(() => {
    updateCampaign({
      ...campaign,
      profile: {
        completed: true,
      },
    });
  }, []);

  const updateColorCallback = async (color) => {
    setColor(color);
    const updatedCampaign = {
      ...campaign,
      color,
    };
    debounce(updateCampaign, updatedCampaign);
  };

  const childProps = {
    ...props,
    editMode: true,
    color,
    updateColorCallback,
  };

  return <CandidatePage {...childProps} />;
}
