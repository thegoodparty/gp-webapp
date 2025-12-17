'use client'
import { useContext } from 'react'
import { MapContext } from './MapSection'
import { Marker, MarkerClusterer } from '@react-google-maps/api'

interface ClusterStyle {
  url: string
  height: number
  width: number
  textColor: string
  textSize: number
}

const clusterStyles: ClusterStyle[] = [
  {
    url: 'https://assets.goodparty.org/map-cluster-icon-center-new.png',
    height: 60,
    width: 60,
    textColor: 'white',
    textSize: 11,
  },
  {
    url: 'https://assets.goodparty.org/map-cluster-icon-center-new.png',
    height: 80,
    width: 80,
    textColor: 'white',
    textSize: 12,
  },
]

interface MarkerData {
  id: string | number
  position: google.maps.LatLngLiteral
}

interface MapContextValue {
  campaigns: MarkerData[]
  onSelectCampaign: (marker: MarkerData) => void
}

export default function Markers(): React.JSX.Element {
  const context = useContext(MapContext)
  const { campaigns, onSelectCampaign } = (context || {}) as Partial<MapContextValue>

  if (!campaigns || campaigns.length === 0) {
    return <></>
  }

  return (
    <MarkerClusterer
      options={{
        maxZoom: 15,
        gridSize: 150,
        styles: clusterStyles,
      }}
    >
      {(clusterer) => (
        <>
          {campaigns?.map((marker) => (
            <Marker
              key={marker.id}
              clusterer={clusterer}
              position={marker.position}
              icon={{
                url: 'https://assets.goodparty.org/gp-marker-single.png',
                scaledSize: new window.google.maps.Size(50, 50),
              }}
              onClick={() => {
                if (onSelectCampaign) {
                  onSelectCampaign(marker)
                }
              }}
            />
          ))}
        </>
      )}
    </MarkerClusterer>
  )
}

