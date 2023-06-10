'use client';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { useEffect, useState } from 'react';
import CandidatePage from './CandidatePage';
import { debounce } from './EditCandidatePage';

export default function ReviewCandidatePage(props) {
  const { candidate, campaign } = props;
  const [color, setColor] = useState(candidate.color || '#734BDC');

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
    color,
    updateColorCallback,
  };

  return <CandidatePage {...childProps} />;
}
