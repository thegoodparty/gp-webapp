'use client'
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import Script from 'next/script'
import mapSkin from '../../candidates/components/map/mapSkin'
import { NEXT_PUBLIC_GOOGLE_MAPS_KEY } from 'appEnv'

const INITIAL_ZOOM = 5
const ZOOMED_IN = 14
const INIT_CENTER = {
  lat: 39.8283,
  lng: -98.5795,
}

const containerStyle = {
  width: '100%',
  height: '100%',
}

const mapOptions = {
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
  styles: mapSkin,
  minZoom: 3,
}

const Map = memo(
  forwardRef(
    (
      {
        places = [],
        isLoaded: externalIsLoaded,
        onMarkerClick,
        height = '400px',
        showInfoWindows = true,
        markerIcon,
        fitBounds = true,
      },
      ref,
    ) => {
      const mapContainerRef = useRef(null)
      const mapRef = useRef(null)
      const markersRef = useRef([])
      const [internalIsLoaded, setInternalIsLoaded] = useState(false)

      const isLoaded =
        externalIsLoaded !== undefined ? externalIsLoaded : internalIsLoaded

      const apiKey = NEXT_PUBLIC_GOOGLE_MAPS_KEY

      useEffect(() => {
        if (
          !isLoaded ||
          !window.google ||
          !mapContainerRef.current ||
          mapRef.current
        )
          return

        if (!mapRef.current) {
          mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
            center: INIT_CENTER,
            zoom: INITIAL_ZOOM,
            ...mapOptions,
          })
        }
      }, [isLoaded])

      const clearMarkers = () => {
        if (markersRef.current.length > 0) {
          markersRef.current.forEach((marker) => marker.setMap(null))
          markersRef.current = []
        }
      }

      const createMarkers = useCallback(() => {
        if (!mapRef.current || !window.google) {
          return []
        }

        const fullBounds = new window.google.maps.LatLngBounds()
        let hasValidPlaces = false

        const markers = places
          .filter((place) => place.lat && place.lng)
          .map((place) => {
            const position = {
              lat: parseFloat(place.lat),
              lng: parseFloat(place.lng),
            }

            const marker = new window.google.maps.Marker({
              optimized: true,
              position,
              map: mapRef.current,
              title: place.title || 'Location',
              //   icon: markerIcon || {
              //     url: 'https://assets.goodparty.org/gp-marker-single.png',
              //     scaledSize: new window.google.maps.Size(50, 50),
              //   },
            })

            if (onMarkerClick) {
              marker.addListener('click', () => {
                onMarkerClick(place)
              })
            }

            if (showInfoWindows && (place.title || place.description)) {
              const infowindow = new google.maps.InfoWindow({
                headerDisabled: true,
                content: `${
                  place.title
                    ? `<h3 style="font-weight: 700">${place.title}</h3>`
                    : ''
                }${place.description ? `<p>${place.description}</p>` : ''}`,
                ariaLabel: place.title || 'Location',
              })

              marker.addListener('mouseover', () => {
                infowindow.open({
                  anchor: marker,
                  map: mapRef.current,
                })
              })

              marker.addListener('mouseout', () => {
                infowindow.close()
              })
            }

            fullBounds.extend(position)
            hasValidPlaces = true

            return marker
          })

        if (fitBounds && hasValidPlaces && places.length > 0) {
          if (places.length === 1) {
            mapRef.current.setCenter({
              lat: parseFloat(places[0].lat),
              lng: parseFloat(places[0].lng),
            })
            mapRef.current.setZoom(ZOOMED_IN)
          } else {
            mapRef.current.fitBounds(fullBounds)
          }
        }

        return markers
      }, [places, onMarkerClick, showInfoWindows, markerIcon, fitBounds])

      useEffect(() => {
        if (!mapRef.current || !isLoaded || !window.google) {
          return
        }

        clearMarkers()

        if (places.length === 0) {
          return
        }

        const markers = createMarkers()
        markersRef.current = markers

        return () => {
          clearMarkers()
        }
      }, [places, isLoaded, createMarkers])

      return (
        <>
          {externalIsLoaded === undefined && (
            <Script
              src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
              onReady={() => {
                setInternalIsLoaded(true)
              }}
            />
          )}
          <div className="relative" style={{ height }}>
            <div ref={mapContainerRef} style={containerStyle}>
              {/* Map will be rendered here */}
            </div>
          </div>
        </>
      )
    },
  ),
)

Map.displayName = 'Map'

export default Map
