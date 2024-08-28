'use client';
import Hero from './Hero';
import { createContext, useState } from 'react';
import Map from './Map';
import Results from './Results';
import Filters from './Filters';

export const MapContext = createContext();

export default function CandidatesPage(props) {
  console.log('props', props.campaigns);
  const { campaigns } = props;
  const initMarkers = (campaigns || []).map((campaign) => {
    return {
      id: campaign.slug,
      position: {
        lat: campaign.geoLocation?.lat,
        lng: campaign.geoLocation?.lng,
      },
      ...campaign,
    };
  });

  const [markers, setMarkers] = useState(initMarkers);
  const [visibleMarkers, setVisibleMarkers] = useState(initMarkers);

  const updateVisibleMarkers = (filteredMarkers) => {
    setVisibleMarkers(filteredMarkers);
  };

  const childProps = {
    markers,
    campaigns,
    visibleMarkers,
    updateVisibleMarkers,
  };

  return (
    <MapContext.Provider value={childProps}>
      <div className="h-[calc(100vh-56px)] md:flex flex-row-reverse border-t border-gray-300">
        <div className="flex-1 h-3/4 md:h-auto">
          {/* <Hero /> */}
          <Map />
        </div>
        <div className="flex flex-col  shadow-lg relative z-20">
          <Filters />
          <Results />
        </div>
      </div>
    </MapContext.Provider>
  );
}
