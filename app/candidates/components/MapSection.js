'use client';
import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import Map from './Map';
import Results from './Results';
import Filters from './Filters';
import { useJsApiLoader } from '@react-google-maps/api';
import CampaignPreview from './CampaignPreview';
import { CircularProgress } from '@mui/material';
import H2 from '@shared/typography/H2';
import { useMapCampaigns } from '@shared/hooks/useMapCampaigns';

export const MapContext = createContext();

const center = {
  lat: 39.8283,
  lng: -98.5795,
};

const apiKey = 'AIzaSyDMcCbNUtBDnVRnoLClNHQ8hVDILY52ez8';

export default function MapSection({ campaigns }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (campaigns && campaigns.length > 0) {
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
      setMarkers(initMarkers);
      setVisibleMarkers(initMarkers);
      setLoading(false);
    }
  }, [campaigns]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: ['places'], // Load the places library for search
  });

  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [mapCenter, setMapCenter] = useState(center);
  const [zoom, setZoom] = useState(5);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
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

  const onSelectCampaign = (campaign) => {
    if (
      !campaign ||
      (selectedCampaign && selectedCampaign.slug === campaign.slug)
    ) {
      setSelectedCampaign(null);
      return;
    }
    setMapCenter({
      lat: campaign.geoLocation.lat,
      lng: campaign.geoLocation.lng,
    });
    setZoom(13);
    setSelectedCampaign(campaign);
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
    onSelectCampaign,
    selectedCampaign,
  };

  console.log('markers', markers);

  return (
    <MapContext.Provider value={childProps}>
      {loading ? (
        <div className="h-[calc(100vh-56px)] flex items-center justify-center flex-col">
          <CircularProgress />
          <H2 className="mt-2">Loading...</H2>
        </div>
      ) : (
        <>
          <div className="h-[calc(100vh-56px)]  bg-primary-dark px-4 lg:px-8">
            <div className="md:flex flex-row-reverse rounded-2xl overflow-hidden">
              <div className="flex-1 h-3/4 md:h-auto">
                <Map />
              </div>
              <div className="flex flex-col  shadow-lg relative z-20">
                <Filters />
                <Results />
                <CampaignPreview />
              </div>
            </div>
          </div>
          <div className="h-4 md:h-8 bg-primary-dark">&nbsp;</div>
        </>
      )}
    </MapContext.Provider>
  );
}
