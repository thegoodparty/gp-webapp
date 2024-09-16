'use client';
import { useMapCampaigns } from '@shared/hooks/useMapCampaigns';
import Hero from './Hero';
import MapSection from './map/MapSection';
import WinnerListSection from './winners/WinnerListSection';
import InfoSection from './InfoSection';
import FacesSection from './FacesSection';
import '@shared/inputs/slick.min.css';
import '@shared/inputs/slick-theme.min.css';
import CommunitySection from './CommunitySection';

export default function CandidatesPage({ count }) {
  const { campaigns } = useMapCampaigns();

  return (
    <>
      <Hero count={count} />
      <MapSection campaigns={campaigns} />
      <WinnerListSection allCampaigns={campaigns} />
      <InfoSection />
      <FacesSection />
      <CommunitySection />
    </>
  );
}
