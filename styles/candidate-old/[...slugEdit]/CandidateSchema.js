import React, { useContext } from 'react';
import { JsonLd } from 'react-schemaorg';

import { candidateRoute, partyResolver } from '/helpers/candidateHelper';

export default function CandidateSchema({ candidate }) {
  const {
    firstName,
    lastName,
    party,
    race,
    image,
    raceDate,
    facebook,
    twitter,
    tiktok,
    snap,
    instagram,
    youtube,
    twitch,
    website,
    linkedin,
  } = candidate;
  const runForRace = `${partyResolver(party)} ${
    party !== 'I' ? 'Party' : ''
  } Candidate for ${race}`;
  const sameAs = [];

  [
    facebook,
    twitter,
    tiktok,
    snap,
    instagram,
    youtube,
    twitch,
    website,
    linkedin,
  ].forEach((channel) => {
    if (channel) {
      sameAs.push(channel);
    }
  });
  return (
    <JsonLd
      item={{
        '@context': 'https://schema.org',
        '@type': 'VoteAction',
        candidate: {
          name: `${firstName} ${lastName}`,
          additionalName: runForRace,
          jobTitle: runForRace,
          description: runForRace,
          givenName: firstName,
          familyName: lastName,
          affiliation: partyResolver(party),
          brand: partyResolver(party),
          image,
          url: `https://goodparty.org${candidateRoute(candidate)}`,
          sameAs,
        },
        actionOption: runForRace,
        endTime: raceDate,
        image,
        name: `${firstName} ${lastName}`,
        sameAs,
      }}
    />
  );
}
