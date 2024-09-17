'use client';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Map from './Map';
import Results from './Results';
import Filters from './Filters';
import { useJsApiLoader } from '@react-google-maps/api';
import CampaignPreview from './CampaignPreview';
import { CircularProgress, debounce } from '@mui/material';
import H2 from '@shared/typography/H2';

export const MapContext = createContext();

const INITIAL_ZOOM = 14;

const center = {
  lat: 39.8283,
  lng: -98.5795,
};

const apiKey = 'AIzaSyDMcCbNUtBDnVRnoLClNHQ8hVDILY52ez8';

export default function MapSection({ campaigns = [] }) {
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [mapCenter, setMapCenter] = useState(center);
  const [zoom, setZoom] = useState(5);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [filters, setFilters] = useState({
    party: '',
    level: '',
    results: false,
    office: '',
    name: '',
  });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: ['places'], // Load the places library for search
  });

  const mapRef = useRef(null);

  useEffect(() => {
    if (campaigns && campaigns.length > 0) {
      const initMarkers = campaigns.map((campaign) => ({
        id: campaign.slug,
        position: {
          lat: campaign.geoLocation?.lat,
          lng: campaign.geoLocation?.lng,
        },
        ...campaign,
      }));
      setMarkers(initMarkers);
      setVisibleMarkers(initMarkers);
      setLoading(false);
    }
  }, [campaigns]);

  // Debounced onChangeFilters to prevent unnecessary renders
  const onChangeFilters = useCallback(
    debounce((key, val) => {
      setFilters((prevFilters) => ({
        ...prevFilters, // Spread the previous filters to retain the current values
        [key]: val, // Update the filter based on the key-value pair
      }));
    }, 300),
    [],
  );

  const filteredMarkers = useMemo(() => {
    let updatedMarkers = markers;
    if (filters.party) {
      updatedMarkers = updatedMarkers.filter(
        (marker) => marker.party === filters.party,
      );
    }
    if (filters.level) {
      updatedMarkers = updatedMarkers.filter(
        (marker) => marker.ballotLevel === filters.level,
      );
    }
    if (filters.office) {
      updatedMarkers = updatedMarkers.filter(
        (marker) => marker.office === filters.office,
      );
    }
    if (filters.name) {
      updatedMarkers = updatedMarkers.filter((marker) => {
        const name = `${marker.firstName} ${marker.lastName}`.toLowerCase();
        return name.includes(filters.name.toLowerCase());
      });
    }
    if (filters.results) {
      updatedMarkers = updatedMarkers.filter(
        (marker) => marker.didWin === true,
      );
    }
    return updatedMarkers;
  }, [filters, markers]);

  // Update visible markers whenever filtered markers change
  useEffect(() => {
    setVisibleMarkers(filteredMarkers);
  }, [filteredMarkers]);

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
          smoothZoom(map, INITIAL_ZOOM, 4); // Adjust final zoom level and initial zoom level as needed
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
    setZoom(INITIAL_ZOOM);
    setSelectedCampaign(campaign);
  };

  // Memoized childProps to prevent unnecessary re-renders
  const childProps = useMemo(
    () => ({
      markers,
      visibleMarkers,
      setVisibleMarkers, // Now passing setVisibleMarkers
      filters,
      onChangeFilters,
      onPlacesChanged,
      mapCenter,
      isLoaded,
      zoom,
      mapRef,
      onSelectCampaign,
      selectedCampaign,
    }),
    [
      markers,
      visibleMarkers,
      filters,
      mapCenter,
      zoom,
      selectedCampaign,
      onPlacesChanged,
      onChangeFilters,
    ],
  );

  return (
    <MapContext.Provider value={childProps}>
      {loading ? (
        <div className="h-[calc(100vh-56px)] flex items-center justify-center flex-col">
          <CircularProgress />
          <H2 className="mt-2">Loading...</H2>
        </div>
      ) : (
        <>
          <section className="h-[calc(100vh-56px)] bg-primary-dark px-4 lg:px-8 overflow-hidden">
            <div className="md:flex flex-row-reverse rounded-2xl overflow-hidden">
              <div className="flex-1 h-3/4 md:h-auto">
                <Map />
              </div>
              <div className="flex flex-col shadow-lg relative z-20">
                <Filters />
                <Results />
                <CampaignPreview />
              </div>
            </div>
          </section>
          <div className="h-4 md:h-8 bg-primary-dark">&nbsp;</div>
        </>
      )}
    </MapContext.Provider>
  );
}
