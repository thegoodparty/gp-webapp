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
import CampaignPreview from './CampaignPreview';
import { CircularProgress, debounce } from '@mui/material';
import H2 from '@shared/typography/H2';
import WinnerListSection from '../winners/WinnerListSection';
import { useMapCampaigns } from '@shared/hooks/useMapCampaigns';

export const MapContext = createContext();

const ZOOMED_IN = 14;
const INITIAL_ZOOM = 5;

const center = {
  lat: 39.8283,
  lng: -98.5795,
};

export default function MapSection({ isLoaded, state }) {
  const [allCampaigns, setAllCampaigns] = useState(null); // State to store the first response

  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState(center);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [filters, setFilters] = useState({
    party: '',
    state: state || '',
    level: '',
    results: false,
    office: '',
    name: '',
    neLat: false,
    neLng: false,
    swLat: false,
    swLng: false,
  });
  const isFilterEmpty = Object.values(filters).every((val) => !val);
  const { campaigns } = useMapCampaigns(isFilterEmpty ? null : filters);

  useEffect(() => {
    // Only cache the first response
    if (campaigns.length > 0 && !allCampaigns && isFilterEmpty) {
      setAllCampaigns(campaigns);
    }
  }, [campaigns, allCampaigns, isFilterEmpty]);

  const mapRef = useRef(null);

  useEffect(() => {
    if (campaigns && campaigns.length > 0) {
      setLoading(false);
    }
  }, [campaigns]);

  // Debounced onChangeFilters to prevent unnecessary renders
  const onChangeFilters = useCallback((key, val) => {
    setFilters((prevFilters) => ({
      ...prevFilters, // Spread the previous filters to retain the current values
      [key]: val, // Update the filter based on the key-value pair
    }));
  }, []);

  const onChangeMapBounds = useCallback((bounds) => {
    setFilters((prevFilters) => ({
      ...prevFilters, // Spread the previous filters to retain the current values
      ...bounds,
    }));
  }, []);

  const onSelectCampaign = (campaign) => {
    if (
      !campaign ||
      (selectedCampaign && selectedCampaign.slug === campaign.slug)
    ) {
      setSelectedCampaign(null);
      return;
    }
    setMapCenter({
      lat: campaign.position.lat,
      lng: campaign.position.lng,
    });
    setZoom(ZOOMED_IN);
    setSelectedCampaign(campaign);
  };

  // Memoized childProps to prevent unnecessary re-renders
  const childProps = useMemo(
    () => ({
      campaigns,
      filters,
      onChangeFilters,
      mapCenter,
      isLoaded,
      zoom,
      mapRef,
      onSelectCampaign,
      selectedCampaign,
      onChangeMapBounds,
    }),
    [
      campaigns,
      filters,
      mapCenter,
      isLoaded,
      zoom,
      selectedCampaign,
      onChangeFilters,
      onChangeMapBounds,
    ],
  );

  if (selectedCampaign) {
    console.log('selectedCampaign', selectedCampaign);
  }

  return (
    <>
      <MapContext.Provider value={childProps}>
        {loading ? (
          <div className="h-[calc(100vh-56px)] flex items-center justify-center flex-col">
            <CircularProgress />
            <H2 className="mt-2">Loading...</H2>
          </div>
        ) : (
          <>
            <section className="md:h-[calc(100vh-56px)] bg-primary-dark px-4 lg:px-8 overflow-hidden relative">
              <div className="md:flex flex-row-reverse rounded-2xl overflow-hidden">
                <div className="flex-1 h-3/4 md:h-auto">
                  <Map />
                </div>
                <div className="flex flex-col shadow-lg md:relative z-20">
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
      <WinnerListSection allCampaigns={allCampaigns} />
    </>
  );
}
