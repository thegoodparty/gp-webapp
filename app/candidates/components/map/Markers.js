'use client'
import { useContext } from 'react'
import { MapContext } from './MapSection'
import { Marker, MarkerClusterer } from '@react-google-maps/api'

const clusterStyles = [
  {
    url: 'https://assets.goodparty.org/map-cluster-icon-center-new.png', // URL to the cluster image
    height: 60, // Height of the cluster image
    width: 60, // Width of the cluster image
    textColor: 'white', // Text color for the cluster count
    textSize: 11, // Text size for the cluster count
  },
  {
    url: 'https://assets.goodparty.org/map-cluster-icon-center-new.png', // URL to the cluster image
    height: 80, // Height of the cluster image
    width: 80, // Width of the cluster image
    textColor: 'white', // Text color for the cluster count
    textSize: 12, // Text size for the cluster count
  },
]

export default function Markers() {
  const { campaigns, onSelectCampaign } = useContext(MapContext)

  return (
    <MarkerClusterer
      options={{
        maxZoom: 15, // Set the maxZoom level to stop clustering at this zoom level or higher
        gridSize: 150,
        styles: clusterStyles,
      }}
    >
      {(clusterer) =>
        campaigns.map((marker) => (
          <Marker
            key={marker.id}
            clusterer={clusterer}
            position={marker.position}
            icon={{
              url: 'https://assets.goodparty.org/gp-marker-single.png',
              scaledSize: new window.google.maps.Size(50, 50),
            }}
            onClick={() => {
              onSelectCampaign(marker)
            }}
          />
        ))
      }
    </MarkerClusterer>
  )
}
