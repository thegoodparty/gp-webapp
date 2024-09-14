'use client';
import { useMapCampaigns } from '@shared/hooks/useMapCampaigns';
import Hero from './Hero';
import MapSection from './MapSection';

export default function CandidatesPage(props) {
  const { campaigns } = useMapCampaigns();

  return (
    <>
      <Hero count={campaigns.length} />
      <MapSection campaigns={campaigns} />
    </>
  );
}
