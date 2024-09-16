'use client';

import { useContext } from 'react';
import CampaignSnippet from './CampaignSnippet';
import { MapContext } from './MapSection';
import H5 from '@shared/typography/H5';

export default function Results(props) {
  const { visibleMarkers } = useContext(MapContext);
  return (
    <div className="md:w-[400px] lg:w-[500px]  md:h-[calc(100vh-56px-72px)] border-r border-gray-300 md:overflow-y-auto bg-indigo-100 overflow-auto">
      <H5 className="p-6">{visibleMarkers.length} candidates</H5>
      {visibleMarkers.map((campaign) => (
        <CampaignSnippet key={campaign.slug} campaign={campaign} />
      ))}
    </div>
  );
}
