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
import ShareMap from './ShareMap';
import { useRouter } from 'next/navigation';
import { debounce2 } from 'helpers/debounceHelper';

export const MapContext = createContext();

const ZOOMED_IN = 14;
const INITIAL_ZOOM = 5;

const INIT_CENTER = {
  lat: 39.8283,
  lng: -98.5795,
};

export default function MapSection({ isLoaded, state, searchParams }) {
  const [allCampaigns, setAllCampaigns] = useState(null); // State to store the first response
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [filters, setFilters] = useState({
    party: searchParams?.party || '',
    state: state || '',
    level: searchParams?.level || '',
    results: searchParams?.results === 'true',
    office: searchParams?.office || '',
    name: searchParams?.name || '',
    neLat: searchParams?.neLat || false,
    neLng: searchParams?.neLng || false,
    swLat: searchParams?.swLat || false,
    swLng: searchParams?.swLng || false,
    zoom: searchParams?.zoom || INITIAL_ZOOM,
    mapCenterLat: searchParams?.mapCenterLat || '',
    mapCenterLng: searchParams?.mapCenterLng || '',
  });

  useEffect(() => {
    // if (!searchParams) return;

    setFilters({
      party: searchParams?.party || '',
      state: state || '',
      level: searchParams?.level || '',
      results: searchParams?.results === 'true',
      office: searchParams?.office || '',
      name: searchParams?.name || '',
      neLat: searchParams?.neLat || false,
      neLng: searchParams?.neLng || false,
      swLat: searchParams?.swLat || false,
      swLng: searchParams?.swLng || false,
      zoom: searchParams?.zoom || INITIAL_ZOOM,
      mapCenterLat: searchParams?.mapCenterLat || '',
      mapCenterLng: searchParams?.mapCenterLng || '',
    });
  }, [searchParams, state]);

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
    if (campaigns) {
      setLoading(false);
    }
  }, [campaigns]);

  const onChangeFilters = useCallback((key, val) => {
    // add the filters to the url query only if they are not empty
    const query = Object.entries({
      ...filters,
      [key]: val,
    }).reduce((acc, [key, val]) => {
      if (val) {
        acc[key] = val;
      }
      return acc;
    }, {});

    const queryString = new URLSearchParams(query).toString();
    router.push(`?${queryString}`, { scroll: false, shallow: true });
  }, []);

  // on Change Filters that can take multiple keys and values
  const onChangeFiltersMultiple = (newFilters) => {
    const query = Object.entries({
      ...filters,
      ...newFilters,
    }).reduce((acc, [key, val]) => {
      if (val) {
        acc[key] = val;
      }
      return acc;
    }, {});

    const queryString = new URLSearchParams(query).toString();
    router.push(`?${queryString}`, { scroll: false, shallow: true });
  };

  const onChangeMapBounds = useCallback((bounds) => {
    onChangeFiltersMultiple(bounds);
  }, []);

  const onSelectCampaign = (campaign) => {
    if (
      !campaign ||
      (selectedCampaign && selectedCampaign.slug === campaign.slug)
    ) {
      setSelectedCampaign(null);
      return;
    }
    onChangeFiltersMultiple({
      zoom: ZOOMED_IN,
      mapCenterLat: campaign.position.lat,
      mapCenterLng: campaign.position.lng,
    });

    setSelectedCampaign(campaign);
  };
  const center = {
    lat: filters.mapCenterLat
      ? parseFloat(filters.mapCenterLat)
      : INIT_CENTER.lat,
    lng: filters.mapCenterLng
      ? parseFloat(filters.mapCenterLng)
      : INIT_CENTER.lng,
  };

  const zoom = filters.zoom ? parseInt(filters.zoom, 10) : INITIAL_ZOOM;
  // Memoized childProps to prevent unnecessary re-renders
  const childProps = useMemo(
    () => ({
      campaigns,
      filters,
      onChangeFilters,
      mapCenter: center,
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
      center,
      isLoaded,
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
        <div className="bg-primary-dark">
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
          <ShareMap />
          <div className="h-4 md:h-8 bg-primary-dark">&nbsp;</div>
        </div>
      </MapContext.Provider>
      <WinnerListSection allCampaigns={allCampaigns} />
    </>
  );
}
