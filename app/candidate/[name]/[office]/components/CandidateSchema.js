import React from 'react'
import { JsonLd } from 'react-schemaorg'
import { APP_BASE } from 'appEnv'

export default function CandidateSchema({ candidate, slug }) {
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

  const address = {
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
