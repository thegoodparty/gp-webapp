'use client';
import Hero from './Hero';
import MapSection from './map/MapSection';
import InfoSection from './InfoSection';
import FacesSection from './FacesSection';
import '@shared/inputs/slick.min.css';
import '@shared/inputs/slick-theme.min.css';
import CommunitySection from './CommunitySection';
import { useEffect, useState } from 'react';
import UserSnapScript from '@shared/scripts/UserSnapScript';

const apiKey = 'AIzaSyDMcCbNUtBDnVRnoLClNHQ8hVDILY52ez8';

export default function CandidatesPage({ count, longState, state }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (isAdded) {
      return;
    }
    setIsAdded(true);
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script); // Cleanup when unmounted
    };
  }, []);

  return (
    <>
      <Hero count={count} longState={longState} />
      <MapSection isLoaded={isLoaded} state={state} />
      <InfoSection />
      <FacesSection />
      <CommunitySection />
      <UserSnapScript />
    </>
  );
}
