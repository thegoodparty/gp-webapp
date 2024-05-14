'use client';
import React, { useEffect, useRef } from 'react';
import {
  GoogleMap,
  useLoadScript,
  StreetViewPanorama,
} from '@react-google-maps/api';

const apiKey = 'AIzaSyDMcCbNUtBDnVRnoLClNHQ8hVDILY52ez8';

const StreetViewMap = ({ voter }) => {
  const location = {
    lat: voter.lat ? parseFloat(voter.lat) : 0,
    lng: voter.lng ? parseFloat(voter.lng) : 0,
    address: `${voter.address}, ${voter.city} ${voter.state},${voter.zip}`,
  };
  console.log('location', location);
  console.log('voter', voter);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  const mapRef = useRef(null);
  const streetViewRef = useRef(null);

  useEffect(() => {
    if (isLoaded && streetViewRef.current) {
      const panorama = new window.google.maps.StreetViewPanorama(
        streetViewRef.current,
        {
          position: { lat: location.lat, lng: location.lng },
          pov: { heading: 100, pitch: 0 },
          zoom: 1,
        },
      );

      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: panorama,
        title: location.address,
      });
    }
  }, [isLoaded, location]);

  if (!voter || !voter.lat || !voter.lng) {
    return null;
  }

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div className=" h-64 w-full" ref={mapRef}>
      <div className="h-full" ref={streetViewRef}></div>
    </div>
  );
};

export default StreetViewMap;
