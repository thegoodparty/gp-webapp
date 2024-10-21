'use client';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import mapSkin from './mapSkin';
import H3 from '@shared/typography/H3';
import { MapContext } from './MapSection';

import {
  MarkerClusterer,
  SuperClusterAlgorithm,
} from '@googlemaps/markerclusterer';
import { debounce, debounce2 } from 'helpers/debounceHelper';
import { useRouter, useSearchParams } from 'next/navigation';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions = {
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
  styles: mapSkin,
  minZoom: 4,
};

const Map = () => {
  const {
    campaigns,
    mapCenter,
    isLoaded,
    zoom,
    onChangeMapBounds,
    onSelectCampaign,
    filters,
  } = useContext(MapContext);

  const router = useRouter();
  const searchParams = useSearchParams();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const markerClusterRef = useRef(null);

  // Memoize the map center to prevent unnecessary re-renders
  const memoizedCenter = useMemo(() => mapCenter, [mapCenter]);

  // Initialize Google Map once
  useEffect(() => {
    if (
      !isLoaded ||
      !window.google ||
      !mapContainerRef.current ||
      mapRef.current
    )
      return;

    const mapInstance = new window.google.maps.Map(mapContainerRef.current, {
      center: memoizedCenter,
      zoom,
      ...mapOptions,
    });

    mapRef.current = mapInstance;

    const debouncedUpdateBounds = debounce2(() => {
      const bounds = mapInstance.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const currentCenter = mapInstance.getCenter();
        const currentZoom = mapInstance.getZoom();

        if (
          filters.neLat !== ne?.lat() ||
          filters.neLng !== ne?.lng() ||
          filters.swLat !== sw?.lat() ||
          filters.swLng !== sw?.lng()
        ) {
          onChangeMapBounds({
            neLat: ne?.lat(),
            neLng: ne?.lng(),
            swLat: sw?.lat(),
            swLng: sw?.lng(),
            mapCenterLat: currentCenter?.lat(),
            mapCenterLng: currentCenter?.lng(),
            zoom: currentZoom,
          });
        }
      }
    }, 500);

    const idleListener = mapInstance.addListener('idle', () => {
      debouncedUpdateBounds();
    });

    return () => {
      window.google.maps.event.removeListener(idleListener);
    };
  }, [isLoaded, memoizedCenter, zoom, onChangeMapBounds, filters]);

  // Update map center and zoom without reinitializing the map
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setCenter(memoizedCenter);
      mapRef.current.setZoom(zoom);
    }
  }, [memoizedCenter, zoom]);

  const clearMarkers = () => {
    if (markersRef.current.length > 0) {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    }

    if (markerClusterRef.current) {
      markerClusterRef.current.clearMarkers();
      markerClusterRef.current = null;
    }
  };

  // Memoize the createMarkers function to prevent it from changing on every render
  const createMarkers = useCallback(() => {
    if (!mapRef.current || !window.google) {
      console.log('Map or Google not ready yet');
      return [];
    }

    return campaigns.map((campaign) => {
      const marker = new window.google.maps.Marker({
        position: campaign.position,
        map: mapRef.current,
        title: campaign.name,
        icon: {
          url: 'https://assets.goodparty.org/gp-marker-single.png',
          scaledSize: new window.google.maps.Size(50, 50),
        },
      });

      marker.addListener('click', () => {
        onSelectCampaign(campaign);
      });

      return marker;
    });
  }, [campaigns, onSelectCampaign]);

  // Update markers when campaigns change
  useEffect(() => {
    if (!mapRef.current || !isLoaded || !window.google) {
      return;
    }

    if (campaigns.length === 0) {
      clearMarkers();
      return;
    }

    clearMarkers();
    const markers = createMarkers();
    markersRef.current = markers;

    if (markerClusterRef.current) {
      markerClusterRef.current.clearMarkers();
    }

    const algorithm = new SuperClusterAlgorithm({
      maxZoom: 15,
      radius: 150,
    });

    const newMarkerCluster = new MarkerClusterer({
      markers,
      map: mapRef.current,
      algorithm: algorithm,
      renderer: {
        render({ count, position }) {
          let iconSize, labelFontSize;
          if (count < 10) {
            iconSize = new window.google.maps.Size(60, 60);
            labelFontSize = '11px';
          } else if (count < 100) {
            iconSize = new window.google.maps.Size(80, 80);
            labelFontSize = '11px';
          } else {
            iconSize = new window.google.maps.Size(100, 100);
            labelFontSize = '11px';
          }

          return new window.google.maps.Marker({
            position,
            icon: {
              url: 'https://assets.goodparty.org/map-cluster-icon-center.png',
              scaledSize: iconSize,
              labelOrigin: new window.google.maps.Point(
                iconSize.width / 2,
                iconSize.height / 2,
              ),
            },
            label: {
              text: String(count),
              color: 'white',
              fontSize: labelFontSize,
              className: 'cluster-label',
            },
            clickable: true,
          });
        },
      },
    });

    markerClusterRef.current = newMarkerCluster;

    return () => {
      clearMarkers();
    };
  }, [campaigns, isLoaded, createMarkers]);

  // Listen for URL changes to update the map when back button is pressed
  useEffect(() => {
    const lat = parseFloat(searchParams.get('mapCenterLat'));
    const lng = parseFloat(searchParams.get('mapCenterLng'));
    const zoomLevel = parseInt(searchParams.get('zoom'), 10);

    if (mapRef.current && !isNaN(lat) && !isNaN(lng) && !isNaN(zoomLevel)) {
      mapRef.current.setCenter({ lat, lng });
      mapRef.current.setZoom(zoomLevel);
    }
  }, [searchParams.toString()]);

  return (
    <div className="h-[calc(100vh-56px-220px)] md:h-[calc(100vh-56px)] relative">
      <div ref={mapContainerRef} style={containerStyle}>
        {/* Map will be rendered here */}
      </div>
    </div>
  );
};

Map.displayName = 'Map';

export default Map;
