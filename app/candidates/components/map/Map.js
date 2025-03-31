'use client';
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import mapSkin from './mapSkin';
import {
  MarkerClusterer,
  SuperClusterAlgorithm,
} from '@googlemaps/markerclusterer';
import { debounce2 } from 'helpers/debounceHelper';
import { useSearchParams, useRouter } from 'next/navigation';
import { isObjectEqual } from 'helpers/objectHelper';

const INITIAL_ZOOM = 5;
const ZOOMED_IN = 14;
const INIT_CENTER = {
  lat: 39.8283,
  lng: -98.5795,
};

const containerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions = {
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
  styles: mapSkin,
  minZoom: 3,
};

const Map = memo(
  forwardRef(
    (
      {
        campaigns,
        isLoaded,
        onChangeMapBounds,
        onSelectCampaign,
        onClusterClick,
      },
      ref,
    ) => {
      const router = useRouter();
      const searchParams = useSearchParams();
      const mapContainerRef = useRef(null);
      const mapRef = useRef(null);
      const markersRef = useRef([]);
      const markerClusterRef = useRef(null);
      const firstMarkerRender = useRef(true);

      useImperativeHandle(
        ref,
        () => {
          return {
            moveMapWithHistory: (boundsOrPoint) => {
              const paramsWithBounds = new URLSearchParams({
                ...Object.fromEntries(searchParams),
                bounds: JSON.stringify(mapRef.current.getBounds()),
              });

              // replace current history with current map bounds for Back functionality
              // using window.history here instead of router to replace the history instantly
              window.history.replaceState(
                {},
                undefined,
                `?${paramsWithBounds.toString()}`,
              );

              // set new map position
              if (boundsOrPoint === 'full') {
                //set to full bounds of campaign markers
                const fullBounds = new window.google.maps.LatLngBounds();
                for (const campaign of campaigns) {
                  if (
                    campaign.globalPosition?.lat &&
                    campaign.globalPosition?.lng
                  )
                    fullBounds.extend(campaign.globalPosition);
                }
                mapRef.current.fitBounds(fullBounds);
              } else if (
                boundsOrPoint instanceof window.google.maps.LatLngBounds
              ) {
                // bounds object
                mapRef.current.fitBounds(boundsOrPoint);
              } else {
                // point object
                mapRef.current.setZoom(ZOOMED_IN);
                mapRef.current.setCenter(boundsOrPoint);
              }

              // wait for map to stop moving, then update history with new bounds
              const listener = mapRef.current.addListener('idle', () => {
                paramsWithBounds.set(
                  'bounds',
                  JSON.stringify(mapRef.current.getBounds()),
                );

                // push history with new bounds
                router.push(`?${paramsWithBounds.toString()}`, {
                  scroll: false,
                  shallow: true,
                });

                // remove listener, only want the callback to run once per move
                google.maps.event.removeListener(listener);
              });
            },
          };
        },
        [searchParams, router, campaigns],
      );

      // Initialize Google Map once
      useEffect(() => {
        if (
          !isLoaded ||
          !window.google ||
          !mapContainerRef.current ||
          mapRef.current
        )
          return;

        if (!mapRef.current) {
          mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
            center: INIT_CENTER,
            zoom: INITIAL_ZOOM,
            ...mapOptions,
          });
        }

        const debouncedUpdateBounds = debounce2(() => {
          const bounds = mapRef.current.getBounds();
          if (bounds) {
            onChangeMapBounds(bounds);
          }
        }, 500);

        const idleListener = mapRef.current.addListener(
          'bounds_changed',
          () => {
            debouncedUpdateBounds();
          },
        );

        return () => {
          window.google.maps.event.removeListener(idleListener);
        };
      }, [isLoaded, onChangeMapBounds]);

      const clearMarkers = () => {
        if (markersRef.current.length > 0) {
          markersRef.current.forEach((marker) => marker.setMap(null));
          markersRef.current = [];
        }

        if (markerClusterRef.current) {
          markerClusterRef.current.clearMarkers();
          markerClusterRef.current = null;
        }
      };

      // Memoize the createMarkers function to prevent it from changing on every render
      const createMarkers = useCallback(() => {
        if (!mapRef.current || !window.google) {
          console.log('Map or Google not ready yet');
          return [];
        }

        // bounds object, will use below to move map to contain all markers
        const fitBounds = firstMarkerRender.current;
        const fullBounds = new window.google.maps.LatLngBounds();

        const markers = campaigns.map((campaign) => {
          const title = `${campaign.firstName} ${campaign.lastName}`;
          const marker = new window.google.maps.Marker({
            optimized: true,
            position: campaign.globalPosition,
            map: mapRef.current,
            title,
            icon: {
              url: 'https://assets.goodparty.org/gp-marker-single.png',
              scaledSize: new window.google.maps.Size(50, 50),
            },
          });

          marker.addListener('click', () => {
            onSelectCampaign(campaign);
          });

          const infowindow = new google.maps.InfoWindow({
            headerDisabled: true,
            content: `<h3 style="font-weight: 700">${title}</h3><p>Candidate for ${campaign.normalizedOffice}</p>`,
            ariaLabel: campaign.name,
          });

          marker.addListener('mouseover', () => {
            infowindow.open({
              anchor: marker,
              map: mapRef.current,
            });
          });

          marker.addListener('mouseout', () => {
            infowindow.close();
          });

          // add campaign position to full bounds object
          if (
            fitBounds &&
            campaign.globalPosition?.lat &&
            campaign.globalPosition?.lng
          )
            fullBounds.extend(campaign.globalPosition);

          return marker;
        });

        // fit map to full bounds of all campaigns
        if (fitBounds) {
          mapRef.current.fitBounds(fullBounds);
          firstMarkerRender.current = false;
        }

        return markers;
      }, [campaigns, onSelectCampaign]);

      // Update markers when campaigns change
      useEffect(() => {
        if (!mapRef.current || !isLoaded || !window.google) {
          return;
        }

        if (campaigns.length === 0) {
          clearMarkers();
          return;
        }

        clearMarkers();
        const markers = createMarkers();
        markersRef.current = markers;

        if (markerClusterRef.current) {
          markerClusterRef.current.clearMarkers();
        }

        const algorithm = new SuperClusterAlgorithm({
          maxZoom: 15,
          radius: 150,
        });

        const newMarkerCluster = new MarkerClusterer({
          markers,
          map: mapRef.current,
          algorithm: algorithm,
          onClusterClick: (_e, cluster) => {
            onClusterClick(cluster);
          },
          renderer: {
            render({ count, position }) {
              let iconSize, labelFontSize;
              if (count < 10) {
                iconSize = new window.google.maps.Size(60, 60);
                labelFontSize = '11px';
              } else if (count < 100) {
                iconSize = new window.google.maps.Size(80, 80);
                labelFontSize = '11px';
              } else {
                iconSize = new window.google.maps.Size(100, 100);
                labelFontSize = '11px';
              }

              return new window.google.maps.Marker({
                optimized: true,
                position,
                icon: {
                  url: 'https://assets.goodparty.org/map-cluster-icon-center-new.png',
                  scaledSize: iconSize,
                  labelOrigin: new window.google.maps.Point(
                    iconSize.width / 2,
                    iconSize.height / 2,
                  ),
                },
                label: {
                  text: String(count),
                  color: 'white',
                  fontSize: labelFontSize,
                  className: 'cluster-label',
                },
              });
            },
          },
        });

        markerClusterRef.current = newMarkerCluster;

        return () => {
          clearMarkers();
        };
      }, [campaigns, isLoaded, createMarkers]);

      // Listen for URL changes to update the map when back button is pressed
      useEffect(() => {
        if (!searchParams.has('bounds')) return;
        const boundsParam = searchParams.get('bounds');

        try {
          const bounds = JSON.parse(boundsParam);
          const mapBounds = mapRef.current?.getBounds().toJSON();

          if (
            mapRef.current &&
            typeof bounds === 'object' &&
            !isObjectEqual(bounds, mapBounds)
          ) {
            mapRef.current.fitBounds(bounds);
          }
        } catch (e) {
          console.error('Failed to move map bounds: ', e);
        }
      }, [searchParams.toString()]);

      return (
        <div className="h-[calc(100vh-56px-220px)] md:h-[calc(100vh-56px)] relative">
          <div ref={mapContainerRef} style={containerStyle}>
            {/* Map will be rendered here */}
          </div>
        </div>
      );
    },
  ),
);

Map.displayName = 'Map';

export default Map;
