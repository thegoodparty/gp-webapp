'use client';
import Hero from './Hero';
import MapSection from './map/MapSection';
import InfoSection from './InfoSection';
import FacesSection from './FacesSection';
import '@shared/inputs/slick.min.css';
import '@shared/inputs/slick-theme.min.css';
import CommunitySection from './CommunitySection';
import { useJsApiLoader } from '@react-google-maps/api';

const apiKey = 'AIzaSyDMcCbNUtBDnVRnoLClNHQ8hVDILY52ez8';

export default function CandidatesPage({ count }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: ['places'], // Load the places library for search
  });
  return (
    <>
      <Hero count={count} />
      <MapSection isLoaded={isLoaded} />
      <InfoSection />
      <FacesSection />
      <CommunitySection />
    </>
  );
}
