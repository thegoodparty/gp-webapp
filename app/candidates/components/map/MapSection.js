'use client';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Map from './Map';
import Results from './Results';
import Filters from './Filters';
import CampaignPreview from './CampaignPreview';
import { CircularProgress } from '@mui/material';
import H2 from '@shared/typography/H2';
import WinnerListSection from '../winners/WinnerListSection';
import { useMapCampaigns } from '@shared/hooks/useMapCampaigns';
import ShareMap from './ShareMap';

export const MapContext = createContext();

const ZOOMED_IN = 14;
const INITIAL_ZOOM = 5;

const center = {
  lat: 39.8283,
  lng: -98.5795,
};

export default function MapSection({ isLoaded, state }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allCampaigns, setAllCampaigns] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState(center); // Manages map's center state
  const [zoom, setZoom] = useState(INITIAL_ZOOM); // Manages map's zoom state
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

  // Ensure useMapCampaigns is invoked on filter change
  const isFilterEmpty = Object.values(filters).every((val) => !val);
  const { campaigns, isCampaignsLoading, setIsCampaignsLoading } =
    useMapCampaigns(isFilterEmpty ? null : filters);

  const mapRef = useRef(null);

  useEffect(() => {
    if (campaigns.length > 0 && !allCampaigns && isFilterEmpty) {
      setAllCampaigns(campaigns);
    }
  }, [campaigns, allCampaigns, isFilterEmpty]);

  useEffect(() => {
    if (campaigns && campaigns.length > 0) {
      setLoading(false);
    }
  }, [campaigns]);

  // Sync filters and map bounds with URL query
  const updateQueryParams = useCallback(
    (newFilters, newMapCenter, newZoom) => {
      const query = Object.keys(newFilters).reduce((acc, key) => {
        if (newFilters[key]) {
          acc[key] = newFilters[key];
        }
        return acc;
      }, {});

      if (newMapCenter) {
        query['lat'] = newMapCenter.lat;
        query['lng'] = newMapCenter.lng;
      }

      if (newZoom) {
        query['zoom'] = newZoom;
      }

      const queryString = new URLSearchParams(query).toString();

      router.push(`?${queryString}`, { scroll: false, shallow: true });
    },
    [router],
  );

  const onChangeFilters = useCallback(
    (key, val) => {
      setFilters((prevFilters) => {
        const newFilters = {
          ...prevFilters,
          [key]: val,
        };
        updateQueryParams(newFilters, mapCenter, zoom); // Update query when filters change
        return newFilters;
      });
      setIsCampaignsLoading(true);
    },
    [mapCenter, zoom, updateQueryParams, setIsCampaignsLoading],
  );

  const onChangeMapBounds = useCallback(
    (bounds) => {
      setFilters((prevFilters) => {
        const newFilters = {
          ...prevFilters,
          ...bounds,
        };
        updateQueryParams(newFilters, mapCenter, zoom); // Update query when map bounds change
        return newFilters;
      });
    },
    [mapCenter, zoom, updateQueryParams],
  );

  // Sync filters, mapCenter, and zoom with the URL query on initial load or back button usage
  useEffect(() => {
    const queryState = searchParams.get('state') || '';
    const queryParty = searchParams.get('party') || '';
    const queryLevel = searchParams.get('level') || '';
    const queryOffice = searchParams.get('office') || '';
    const queryResults = searchParams.get('results') === 'true'; // Convert to boolean
    const queryName = searchParams.get('name') || '';

    // Map center and zoom from the URL
    const queryLat = parseFloat(searchParams.get('lat')) || center.lat;
    const queryLng = parseFloat(searchParams.get('lng')) || center.lng;
    const queryZoom = parseInt(searchParams.get('zoom')) || INITIAL_ZOOM;

    const newFilters = {
      state: queryState,
      party: queryParty,
      level: queryLevel,
      office: queryOffice,
      results: queryResults,
      name: queryName,
      neLat: filters.neLat,
      neLng: filters.neLng,
      swLat: filters.swLat,
      swLng: filters.swLng,
    };

    // Update filters if different from query params
    if (JSON.stringify(filters) !== JSON.stringify(newFilters)) {
      setFilters(newFilters);
    }

    // Update map center and zoom if different
    if (
      mapCenter.lat !== queryLat ||
      mapCenter.lng !== queryLng ||
      zoom !== queryZoom
    ) {
      setMapCenter({ lat: queryLat, lng: queryLng });
      setZoom(queryZoom);
    }
  }, [searchParams, filters, mapCenter, zoom]);

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
    updateQueryParams(
      filters,
      { lat: campaign.position.lat, lng: campaign.position.lng },
      ZOOMED_IN,
    );
  };

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
      isCampaignsLoading,
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
      isCampaignsLoading,
    ],
  );

  return (
    <>
      <MapContext.Provider value={childProps}>
        {loading ? (
          <div className="h-[calc(100vh-56px)] flex items-center justify-center flex-col">
            <CircularProgress />
            <H2 className="mt-2">Loading...</H2>
          </div>
        ) : (
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
        )}
      </MapContext.Provider>
      <WinnerListSection allCampaigns={allCampaigns} />
    </>
  );
}
