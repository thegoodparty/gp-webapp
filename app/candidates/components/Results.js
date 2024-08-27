'use client';

import { useContext } from 'react';
import CampaignSnippet from './CampaignSnippet';
import { MapContext } from './CandidatesPage';

export default function Results(props) {
  const { campaigns } = useContext(MapContext);
  return (
    <div className="md:w-[300px] lg:w-[400px]  h-1/4 md:h-auto border-r border-gray-300 md:overflow-y-auto">
      {campaigns.map((campaign) => (
        <CampaignSnippet key={campaign.slug} campaign={campaign} />
      ))}
    </div>
  );
}
