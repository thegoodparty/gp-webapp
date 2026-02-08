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
import { SearchParams } from 'next/dist/server/request/search-params'
import Script from 'next/script'

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY

interface CandidatesPageProps {
  count: number
  searchParams?: SearchParams
  longState?: string
  state?: string
}

export default function CandidatesPage({
  count,
  searchParams,
  longState,
  state,
}: CandidatesPageProps): React.JSX.Element {
  const [isLoaded, setIsLoaded] = useState(false)

  const mapProps = {
    isLoaded,
    state,
    searchParams,
    count,
  }

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
      <MapSection {...mapProps} />
      <InfoSection />
      <FacesSection />
      <CommunitySection />
      <UserSnapScript />
    </>
  )
}
