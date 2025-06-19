'use client'
import Hero from './Hero'
import MapSection from './map/MapSection'
import InfoSection from './InfoSection'
import FacesSection from './FacesSection'
import '@shared/inputs/slick.min.css'
import '@shared/inputs/slick-theme.min.css'
import CommunitySection from './CommunitySection'
import { useState } from 'react'
import UserSnapScript from '@shared/scripts/UserSnapScript'
import Script from 'next/script'

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY

export default function CandidatesPage({
  count,
  searchParams,
  longState,
  state,
}) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
        onReady={() => {
          console.log('maps loaded')
          setIsLoaded(true)
        }}
      />
      <Hero count={count} longState={longState} />
      <MapSection
        isLoaded={isLoaded}
        state={state}
        searchParams={searchParams}
        count={count}
      />
      <InfoSection />
      <FacesSection />
      <CommunitySection />
      <UserSnapScript />
    </>
  )
}
