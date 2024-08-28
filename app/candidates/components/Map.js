'use client';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { memo, useCallback, useContext, useRef } from 'react';
import mapSkin from './mapSkin';
import Markers from './Markers';
import LoadingMapAnimation from '@shared/animations/LoadingMapAnimation';
import H3 from '@shared/typography/H3';
import { MapContext } from './CandidatesPage';
import { debounce } from 'helpers/debounceHelper';

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
  minZoom: 4,
};

const Map = () => {
  const { markers, updateVisibleMarkers, visibleMarkers } =
    useContext(MapContext);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });
  const mapRef = useRef(null);

  const handleBoundsChanged = useCallback(() => {
    debounce(updateMarkers);
  }, [markers, updateVisibleMarkers]);

  const updateMarkers = () => {
    if (mapRef.current) {
      const bounds = mapRef.current.getBounds();
      const filteredMarkers = markers.filter((marker) =>
        bounds.contains({
          lat: marker.position.lat,
          lng: marker.position.lng,
        }),
      );
      updateVisibleMarkers(filteredMarkers);
    }
  };

  return (
    <div className="h-1/4 md:h-[calc(100vh-56px)]">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={5}
          options={mapOptions}
          onLoad={(map) => (mapRef.current = map)}
          onBoundsChanged={handleBoundsChanged}
        >
          <Markers />
        </GoogleMap>
      ) : (
        <div className="h-[calc(100vh-56px)] flex flex-col items-center justify-center mb-4 py-4">
          <H3>Loading...</H3>
          <LoadingMapAnimation />
        </div>
      )}
    </div>
  );
};

Map.displayName = 'Map';

export default Map;
