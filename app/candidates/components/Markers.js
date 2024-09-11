'use client';
import { useContext } from 'react';
import { MapContext } from './CandidatesPage';
import { Marker, MarkerClusterer } from '@react-google-maps/api';

const clusterStyles = [
  {
    url: 'https://assets.goodparty.org/map-cluster-icon-center.png', // URL to the cluster image
    height: 80, // Height of the cluster image
    width: 80, // Width of the cluster image
    textColor: 'white', // Text color for the cluster count
    textSize: 12, // Text size for the cluster count
  },
  {
    url: 'https://assets.goodparty.org/map-cluster-icon-center.png', // URL to the cluster image
    height: 120, // Height of the cluster image
    width: 120, // Width of the cluster image
    textColor: 'white', // Text color for the cluster count
    textSize: 14, // Text size for the cluster count
  },
];

export default function Markers() {
  const { visibleMarkers, onSelectCampaign } = useContext(MapContext);

  return (
    <MarkerClusterer
      options={{
        maxZoom: 15, // Set the maxZoom level to stop clustering at this zoom level or higher
        gridSize: 80,
        styles: clusterStyles,
      }}
    >
      {(clusterer) =>
        visibleMarkers.map((marker) => (
          <Marker
            key={marker.id}
            clusterer={clusterer}
            position={marker.position}
            icon={{
              url: 'https://assets.goodparty.org/gp-marker-single.png',
            }}
            onClick={() => {
              onSelectCampaign(marker);
            }}
          />
        ))
      }
    </MarkerClusterer>
  );
}
