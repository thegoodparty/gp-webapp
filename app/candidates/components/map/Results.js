'use client';

import { useContext } from 'react';
import CampaignSnippet from './CampaignSnippet';
import { MapContext } from './MapSection';

export default function Results(props) {
  const { visibleMarkers } = useContext(MapContext);
  return (
    <div className="md:w-[300px] lg:w-[400px]  md:h-full border-r border-gray-300 md:overflow-y-auto bg-slate-100">
      {visibleMarkers.map((campaign) => (
        <CampaignSnippet key={campaign.slug} campaign={campaign} />
      ))}
    </div>
  );
}
