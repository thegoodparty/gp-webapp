'use client';
import { useContext } from 'react';
import { MapContext } from './CandidatesPage';
import { Marker } from '@react-google-maps/api';

export default function Markers() {
  const { campaigns } = useContext(MapContext);
  const markers = campaigns.map((campaign) => {
    return {
      id: campaign.slug,
      position: {
        lat: campaign.geoLocation?.lat,
        lng: campaign.geoLocation?.lng,
      },
    };
  });

  return (
    <>
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          icon={{ url: 'https://assets.goodparty.org/heart-hologram.svg' }}
        />
      ))}
    </>
  );
}
