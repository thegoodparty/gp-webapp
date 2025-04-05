import React from 'react'
import { JsonLd } from 'react-schemaorg'
import { APP_BASE } from 'appEnv'

export default function CandidateSchema({ candidate, slug }) {
  const {
    firstName,
    lastName,
    party,
    office,
    city,
    state,
    image,
    socialUrls,
    email,
  } = candidate

  let sameAs = []
  if (socialUrls) {
    sameAs = socialUrls.map((url) => url.url)
  }

  const address = {
    '@type': 'PostalAddress',
    addressRegion: state,
  }

  if (city) {
    address.addressLocality = city
  }

  return (
    <JsonLd
      item={{
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: `${firstName} ${lastName}`,
        image,
        jobTitle: `Candidate for ${office}`,
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
