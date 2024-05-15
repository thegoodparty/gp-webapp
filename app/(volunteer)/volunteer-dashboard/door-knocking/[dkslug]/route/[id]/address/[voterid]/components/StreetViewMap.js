'use client';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';

const apiKey = 'AIzaSyDMcCbNUtBDnVRnoLClNHQ8hVDILY52ez8';

const StreetViewMap = ({ voter }) => {
  const location = useMemo(() => {
    return {
      lat: voter.lat ? parseFloat(voter.lat) : 0,
      lng: voter.lng ? parseFloat(voter.lng) : 0,
      address: `${voter.address}, ${voter.city} ${voter.state},${voter.zip}`,
    };
  }, [voter]);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ['geometry'],
  });

  const mapRef = useRef(null);
  const streetViewRef = useRef(null);
  const [hasStreetView, setHasStreetView] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      const streetViewService = new window.google.maps.StreetViewService();
      const streetViewCheck = new window.google.maps.LatLng(
        location.lat,
        location.lng,
      );

      streetViewService.getPanorama(
        { location: streetViewCheck, radius: 50 },
        (data, status) => {
          if (status === 'OK') {
            setHasStreetView(true);
            if (streetViewRef.current) {
              const panorama = new window.google.maps.StreetViewPanorama(
                streetViewRef.current,
                {
                  position: { lat: location.lat, lng: location.lng },
                  pov: { heading: 0, pitch: 0 },
                  zoom: 1,
                },
              );

              const marker = new window.google.maps.Marker({
                position: { lat: location.lat, lng: location.lng },
                title: location.address,
              });

              // Attach the marker to the panorama
              marker.setMap(panorama);

              // Calculate heading from the panorama position to the marker position
              const pov = panorama.getPov();
              const markerPosition = marker.getPosition();
              const heading =
                window.google.maps.geometry.spherical.computeHeading(
                  panorama.getPosition(),
                  markerPosition,
                );

              panorama.setPov({
                heading: heading,
                pitch: pov.pitch,
              });
            }
          } else {
            setHasStreetView(false);
          }
        },
      );
    }
  }, [isLoaded, location]);

  if (!voter || !voter.lat || !voter.lng) {
    return null;
  }

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return hasStreetView ? (
    <div className=" h-64 w-full" ref={mapRef}>
      <div className="h-full" ref={streetViewRef}></div>
    </div>
  ) : (
    <></>
  );
};

export default memo(StreetViewMap);
