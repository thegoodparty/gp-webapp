'use client';
import { useMapCampaigns } from '@shared/hooks/useMapCampaigns';
import Hero from './Hero';
import MapSection from './map/MapSection';
import WinnerListSection from './WinnerListSection';

export default function CandidatesPage(props) {
  const { campaigns } = useMapCampaigns();

  return (
    <>
      <Hero count={campaigns.length} />
      <MapSection campaigns={campaigns} />
      <WinnerListSection campaigns={campaigns} />
    </>
  );
}
