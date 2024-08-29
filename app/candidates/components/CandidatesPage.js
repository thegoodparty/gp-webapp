'use client';
import Hero from './Hero';
import { createContext, useCallback, useRef, useState } from 'react';
import Map from './Map';
import Results from './Results';
import Filters from './Filters';
import { useJsApiLoader } from '@react-google-maps/api';

export const MapContext = createContext();

const center = {
  lat: 39.8283,
  lng: -98.5795,
};

const apiKey = 'AIzaSyDMcCbNUtBDnVRnoLClNHQ8hVDILY52ez8';

export default function CandidatesPage(props) {
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

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: ['places'], // Load the places library for search
  });

  const mapRef = useRef(null);
  const [markers, _] = useState(initMarkers);
  const [visibleMarkers, setVisibleMarkers] = useState(initMarkers);
  const [mapCenter, setMapCenter] = useState(center);
  const [zoom, setZoom] = useState(5);
  const [filters, setFilters] = useState({
    party: '',
    level: '',
    results: '',
  });

  const onChangeFilters = useCallback((key, val) => {
    const updatedFilters = { ...filters, [key]: val };
    setFilters(updatedFilters);
    filterMarkers(visibleMarkers, updatedFilters);
  }, []);

  const updateVisibleMarkers = (filteredMarkers) => {
    filterMarkers(filteredMarkers, filters);
  };

  const filterMarkers = (currentMarkers, updatedFilters) => {
    if (updatedFilters.party && updatedFilters.party !== '') {
      currentMarkers = currentMarkers.filter(
        (marker) => marker.party === updatedFilters.party,
      );
    }
    if (updatedFilters.level && updatedFilters.level !== '') {
      currentMarkers = currentMarkers.filter(
        (marker) => marker.ballotLevel === updatedFilters.level,
      );
    }
    if (updatedFilters.results && updatedFilters.results !== '') {
      currentMarkers = currentMarkers.filter((marker) => {
        // updated filters values are win lose and running
        // marker results (didWin) are true, false, and null
        if (updatedFilters.results === 'win') {
          return marker.didWin === true;
        }
        if (updatedFilters.results === 'lose') {
          return marker.didWin === false;
        }
        if (updatedFilters.results === 'running') {
          return marker.didWin === null;
        }
      });
    }

    setVisibleMarkers(currentMarkers);
  };

  const onPlacesChanged = (places) => {
    if (places.length > 0) {
      const place = places[0];
      const location = place.geometry.location;
      if (mapRef.current) {
        const map = mapRef.current;

        // Step 1: Zoom out
        map.setZoom(4);

        // Step 2: Pan to the new location
        setTimeout(() => {
          map.panTo({ lat: location.lat(), lng: location.lng() });

          // Step 3: Smoothly zoom in
          const smoothZoom = (map, targetZoom, currentZoom) => {
            if (currentZoom >= targetZoom) return;
            const zoomStep = currentZoom + 1;
            map.setZoom(zoomStep);

            // Use setTimeout for a smooth transition
            setTimeout(() => {
              smoothZoom(map, targetZoom, zoomStep);
            }, 200); // Adjust the delay for smoother or faster transitions
          };

          // Start smooth zoom
          smoothZoom(map, 13, 4); // Adjust final zoom level and initial zoom level as needed
        }, 500); // Delay to allow pan to start
      }
    }
  };

  const childProps = {
    markers,
    campaigns,
    visibleMarkers,
    updateVisibleMarkers,
    filters,
    onChangeFilters,
    onPlacesChanged,
    mapCenter,
    isLoaded,
    zoom,
    mapRef,
  };

  console.log('markers', markers);

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
