'use client';
import { useContext } from 'react';
import { MapContext } from './CandidatesPage';
import { Marker, MarkerClusterer } from '@react-google-maps/api';

export default function Markers() {
  const { visibleMarkers } = useContext(MapContext);

  return (
    <MarkerClusterer
      options={{
        maxZoom: 15, // Set the maxZoom level to stop clustering at this zoom level or higher
        gridSize: 80,
      }}
    >
      {(clusterer) =>
        visibleMarkers.map((marker) => (
          <Marker
            key={marker.id}
            clusterer={clusterer}
            position={marker.position}
            icon={{ url: 'https://assets.goodparty.org/heart-hologram.svg' }}
          />
        ))
      }
    </MarkerClusterer>
  );
}
