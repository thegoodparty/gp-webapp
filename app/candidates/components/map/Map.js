'use client';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import mapSkin from './mapSkin';
import H3 from '@shared/typography/H3';
import { MapContext } from './MapSection';

import {
  MarkerClusterer,
  SuperClusterAlgorithm,
} from '@googlemaps/markerclusterer';
import { debounce } from 'helpers/debounceHelper';

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
    isFilterChanged,
    setIsFilterChanged,
  } = useContext(MapContext);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const markerClusterRef = useRef(null);
  const isProgrammaticChangeRef = useRef(false);
  // Initialize Google Map
  useEffect(() => {
    if (!isLoaded || !window.google || !mapContainerRef.current) return;

    const mapInstance = new window.google.maps.Map(mapContainerRef.current, {
      center: mapCenter,
      zoom: zoom,
      ...mapOptions,
    });

    mapRef.current = mapInstance;

    const idleListener = mapInstance.addListener('idle', () => {
      if (isProgrammaticChangeRef.current) {
        isProgrammaticChangeRef.current = false;
        return;
      }

      const bounds = mapInstance.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        debounce(onChangeMapBounds, 500, {
          neLat: ne.lat(),
          neLng: ne.lng(),
          swLat: sw.lat(),
          swLng: sw.lng(),
        });
      }
    });

    // Cleanup listener on unmount
    return () => {
      window.google.maps.event.removeListener(idleListener);
    };
  }, [isLoaded, mapCenter, zoom, onChangeMapBounds]);

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

  const adjustMapBounds = useCallback(() => {
    if (!mapRef.current || campaigns.length === 0) {
      return;
    }
    if (isFilterChanged) {
      const bounds = new window.google.maps.LatLngBounds();

      campaigns.forEach((campaign) => {
        bounds.extend(campaign.position);
      });

      isProgrammaticChangeRef.current = true;
      mapRef.current.fitBounds(bounds);
      setIsFilterChanged(false);
    }
  }, [campaigns, isFilterChanged]);

  // Custom renderer for cluster icons
  const customRenderer = {
    render({ count, position }) {
      let iconSize, labelFontSize;
      if (count < 10) {
        iconSize = new window.google.maps.Size(60, 60);
        labelFontSize = '11px';
      }
      if (count < 100) {
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
  };

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
      renderer: customRenderer,
    });

    markerClusterRef.current = newMarkerCluster;

    adjustMapBounds();

    // Cleanup on unmount
    return () => {
      clearMarkers();
    };
  }, [campaigns, isLoaded, adjustMapBounds]);

  return (
    <div className="h-[calc(100vh-56px-220px)] md:h-[calc(100vh-56px)]">
      {isLoaded ? (
        <div ref={mapContainerRef} style={containerStyle}>
          {/* Map will be rendered here */}
        </div>
      ) : (
        <div className="h-[calc(100vh-56px)] flex flex-col items-center justify-center mb-4 py-4">
          <H3>Loading...</H3>
        </div>
      )}
    </div>
  );
};

Map.displayName = 'Map';

export default Map;
