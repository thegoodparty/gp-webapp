import React from 'react'
import { JsonLd } from 'react-schemaorg'
import { APP_BASE } from 'appEnv'

interface CandidateUrl {
  url: string
}

interface CandidateData {
  firstName: string
  lastName: string
  party: string
  positionName: string
  placeName?: string
  state: string
  image: string
  urls?: (string | CandidateUrl)[]
  email?: string
}

interface CandidateSchemaProps {
  candidate: CandidateData
  slug: string
}

export default function CandidateSchema({
  candidate,
  slug,
}: CandidateSchemaProps): React.JSX.Element {
  const {
    firstName,
    lastName,
    party,
    positionName,
    placeName,
    state,
    image,
    urls,
    email,
  } = candidate

  const sameAs = Array.isArray(urls)
    ? urls.map((u) => (typeof u === 'string' ? u : u?.url)).filter(Boolean)
    : []

  const address: {
    '@type': 'PostalAddress'
    addressRegion: string
    addressLocality?: string
  } = {
    '@type': 'PostalAddress',
    addressRegion: state,
  }

  if (placeName) {
    address.addressLocality = placeName
  }

  return (
    <JsonLd
      item={{
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: `${firstName} ${lastName}`,
        image,
        jobTitle: `Candidate for ${positionName}`,
        affiliation: {
          '@type': 'PoliticalParty',
          name: party,
        },
        address,
        email,
        sameAs,
        url: `${APP_BASE}/${slug}`,
      }}
    />
  )
}
