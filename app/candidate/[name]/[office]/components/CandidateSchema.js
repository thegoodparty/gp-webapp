import { appBase } from 'gpApi';
import React from 'react';
import { JsonLd } from 'react-schemaorg';

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
  } = candidate;

  let sameAs = [];
  if (socialUrls) {
    sameAs = socialUrls.map((url) => url.url);
  }

  const address = {
    '@type': 'PostalAddress',
    addressRegion: state,
  };

  if (city) {
    address.addressLocality = city;
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
        url: `${appBase}/${slug}`,
      }}
    />
  );
}
