'use client';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useContext } from 'react';
import mapSkin from './mapSkin';
import Markers from './Markers';
import H3 from '@shared/typography/H3';
import { MapContext } from './MapSection';
import { debounce } from 'helpers/debounceHelper';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions = {
  mapTypeControl: false, // Disables the "Map/Satellite" toggle
  fullscreenControl: false, // Disables the fullscreen control button
  streetViewControl: false, // Disables the Street View pegman control
  styles: mapSkin,
  minZoom: 4,
};

const Map = () => {
  const { campaigns, mapCenter, isLoaded, zoom, mapRef, onChangeMapBounds } =
    useContext(MapContext);

  const updateMarkers = useCallback(() => {
    if (mapRef.current) {
      const bounds = mapRef.current.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        console.log('NE (Lat, Lng):', ne.lat(), ne.lng());
        console.log('SW (Lat, Lng):', sw.lat(), sw.lng());

        /*
neLat: false,
    neLng: false,
    swLat: false,
    swLng: false,
  */
        onChangeMapBounds({
          neLat: ne.lat(),
          neLng: ne.lng(),
          swLat: sw.lat(),
          swLng: sw.lng(),
        });
      }
    }
  }, [campaigns, mapRef]);

  const handleBoundsChanged = useCallback(() => {
    debounce(updateMarkers, 300); // Debounced marker update
  }, [updateMarkers]);

  return (
    <div className="h-[calc(100vh-56px-220px)] md:h-[calc(100vh-56px)]">
      {isLoaded ? (
        <>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={zoom}
            options={mapOptions}
            onLoad={(map) => (mapRef.current = map)}
            onBoundsChanged={handleBoundsChanged}
          >
            <Markers />
          </GoogleMap>
        </>
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
