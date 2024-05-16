'use client';
import {
  GoogleMap,
  LoadScript,
  Marker,
  useJsApiLoader,
} from '@react-google-maps/api';
import { useRouter } from 'next/navigation';
const apiKey = 'AIzaSyDMcCbNUtBDnVRnoLClNHQ8hVDILY52ez8';

const DynamicGoogleMap = ({ center, zoom, coordinates }) => {
  const router = useRouter();
  const handleMarkerClick = (url) => {
    router.push(url);
  };
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    // libraries: ['geometry', 'drawing'],
  });
  if (!isLoaded) return <div>loading</div>;
  return (
    <div className="h-[calc(100vh-230px)] w-full  [&>div]:h-[calc(100vh-230px)]">
      <GoogleMap zoom={zoom} center={center}>
        {coordinates.map((coordinate, index) => (
          <Marker
            key={index}
            position={coordinate}
            onClick={() => handleMarkerClick(coordinate.url)}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default DynamicGoogleMap;
