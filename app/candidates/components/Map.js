'use client';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useState } from 'react';
import mapSkin from './mapSkin';
import Markers from './Markers';

const apiKey = 'AIzaSyDMcCbNUtBDnVRnoLClNHQ8hVDILY52ez8';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 39.8283,
  lng: -98.5795,
};

const mapOptions = {
  mapTypeControl: false, // Disables the "Map/Satellite" toggle
  fullscreenControl: false, // Disables the fullscreen control button
  streetViewControl: false, // Disables the Street View pegman control
  styles: mapSkin,
};

export default function Map(props) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });
  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    // const bounds = new window.google.maps.LatLngBounds(center);
    // map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  return (
    <div className="flex-1 h-3/4 md:h-auto">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={5}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={mapOptions}
        >
          <Markers />
        </GoogleMap>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
}
