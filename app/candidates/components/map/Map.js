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
  } = useContext(MapContext);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [markerCluster, setMarkerCluster] = useState(null);

  // Initialize Google Map
  useEffect(() => {
    if (!isLoaded || !window.google || !mapContainerRef.current) return;

    const mapInstance = new window.google.maps.Map(mapContainerRef.current, {
      center: mapCenter,
      zoom: zoom,
      ...mapOptions,
    });

    // Store the map instance
    mapRef.current = mapInstance;

    // Add bounds_changed listener without debounce
    const boundsChangedListener = mapInstance.addListener(
      'bounds_changed',
      () => {
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
      },
    );

    // Cleanup listener on unmount
    return () => {
      window.google.maps.event.removeListener(boundsChangedListener);
    };
  }, [isLoaded, mapCenter, zoom, onChangeMapBounds]);

  const clearMarkers = () => {
    if (markersRef.current.length > 0) {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    } else {
      markersRef.current = [];
    }
    // Clear clusters if they exist
    if (markerCluster) {
      markerCluster.clearMarkers();
      setMarkerCluster(null); // Reset cluster reference
    }
  };

  // Function to create markers
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

      // Add click listener
      marker.addListener('click', () => {
        onSelectCampaign(campaign);
      });

      return marker;
    });
  }, [campaigns, onSelectCampaign]);

  // Custom renderer for cluster icons
  const customRenderer = {
    render({ count, position }) {
      // Determine icon size and text size based on count
      let iconSize, labelFontSize;
      if (count < 10) {
        iconSize = new window.google.maps.Size(60, 60);
        labelFontSize = '11px';
      } else {
        iconSize = new window.google.maps.Size(80, 80);
        labelFontSize = '12px';
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

  // Initialize markers and clusters
  useEffect(() => {
    if (!mapRef.current || !isLoaded || !window.google) {
      return;
    }
    if (campaigns.length === 0) {
      clearMarkers();
      return;
    }

    clearMarkers();
    clearMarkers();
    // Create markers
    const markers = createMarkers();
    markersRef.current = markers;
    markersRef.current = markers;

    // Clear existing cluster if any
    if (markerCluster) {
      markerCluster.clearMarkers();
    }

    // Create an instance of SuperClusterAlgorithm with your options
    const algorithm = new SuperClusterAlgorithm({
      maxZoom: 15,
      radius: 150,
    });

    // Create new marker clusterer with custom renderer and algorithm instance
    const newMarkerCluster = new MarkerClusterer({
      markers,
      map: mapRef.current,
      algorithm: algorithm, // Pass the algorithm instance here
      renderer: customRenderer,
    });

    setMarkerCluster(newMarkerCluster);

    // Cleanup on unmount
    return () => {
      clearMarkers();
    };
  }, [campaigns, isLoaded]);

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
