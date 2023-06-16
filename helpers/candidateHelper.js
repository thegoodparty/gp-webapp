import React from 'react';
import { toPrecision } from './numberHelper';

// returns only articles that match the page.
import { slugify } from './articleHelper';

export const partyResolver = (partyLetter, otherParty) => {
  if (!partyLetter) {
    return '';
  }
  if (partyLetter === 'Other' && otherParty) {
    return otherParty;
  }
  if (partyLetter === 'D') {
    return 'Democratic';
  }
  if (partyLetter === 'R') {
    return 'Republican';
  }
  if (partyLetter === 'GP') {
    return 'Green';
  }
  if (partyLetter === 'LP' || partyLetter === 'L') {
    return 'Libertarian';
  }
  if (partyLetter === 'LI') {
    return 'Liberation';
  }
  if (partyLetter === 'I') {
    return 'Independent';
  }
  if (partyLetter === 'VC') {
    return 'Vetting Challengers';
  }
  if (partyLetter === 'U') {
    return 'Unity';
  }
  if (partyLetter === 'UUP') {
    return 'United Utah';
  }
  if (partyLetter === 'W') {
    return 'Working Families';
  }
  if (partyLetter === 'S') {
    return 'SAM';
  }
  if (partyLetter === 'F') {
    return 'Forward';
  }
  return partyLetter;
};

export const candidateRoute = (candidate) => {
  if (!candidate) {
    return '/';
  }
  const { slug } = candidate;
  return `/candidate/${slug}`;
};

export const getPartyImage = (partyBadge, party, hideBadge) => {
  let PartyImg;
  if (partyBadge) {
    PartyImg = '/images/icons/certification-badge.svg';
  } else if (party === 'D') {
    PartyImg = '/images/icons/democrat.png';
  } else if (party === 'R') {
    PartyImg = '/images/icons/republican.png';
  } else if (party === 'I') {
    PartyImg = '/images/icons/certification-badge.svg';
  } else if (party === 'L') {
    PartyImg = '/images/icons/libertarian.png';
  } else if (party === 'LI') {
    PartyImg = '/images/icons/liberation.png';
  } else if (party === 'P') {
    PartyImg = '/images/icons/progressive.png';
  } else if (party === 'G' || party === 'GP') {
    PartyImg = '/images/icons/green-party.png';
  }
  if (hideBadge) {
    PartyImg = false;
  }
  return PartyImg;
};

export const partyRace = (candidate, withLineBreak = true) => {
  const { party, otherParty, race, office, state, district, counties } =
    candidate;
  let resolvedRace = '';

  if (office) {
    resolvedRace = `${office} ${state ? `(${shortToLongState[state]})` : ''}  ${
      district ? `| District ${district}` : ''
    }`;
  } else {
    resolvedRace = race;
  }
  return (
    <>
      {partyResolver(party, otherParty)} | {resolvedRace}
      {counties && (
        <div style={{ marginTop: '7px', color: '#868686' }}>
          <strong>Counties Served</strong>: {counties}
        </div>
      )}
    </>
  );
};

export const candidateColor = (candidate) => {
  const { color, isClaimed } = candidate;
  if (color?.color) {
    return color.color;
  }
  return '#000';
};

export const candidateHash = (candidate) => {
  if (!candidate) {
    return '';
  }
  if (candidate.hashtag) {
    return candidate.hashtag;
  }
  return `${candidate.firstName?.charAt(0)}${candidate.lastName}2023`;
};

export const campaignHash = (campaign) => {
  if (!campaign) {
    return '';
  }
  if (campaign.hashtag) {
    return campaign.hashtag;
  }
  return `${campaign.details?.firstName?.charAt(0)}${
    campaign.details?.lastName
  }2023`;
};

export const shortToLongState = {
  AL: 'Alabama',
  AK: 'Alaska',
  AS: 'American Samoa',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  DC: 'District Of Columbia',
  FM: 'Federated States Of Micronesia',
  FL: 'Florida',
  GA: 'Georgia',
  GU: 'Guam',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MH: 'Marshall Islands',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  MP: 'Northern Mariana Islands',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PW: 'Palau',
  PA: 'Pennsylvania',
  PR: 'Puerto Rico',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VI: 'Virgin Islands',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
};

export function candidateName(app) {
  let name = 'n/a';
  let { data } = app;
  if (data && typeof data === 'string') {
    data = JSON.parse(data);
  }
  if (data.candidate) {
    name = `${data.candidate.firstName} ${data.candidate.lastName}`;
  }
  return name;
}

export function candidatePhoto(app) {
  let { data } = app;
  if (data && typeof data === 'string') {
    data = JSON.parse(data);
  }
  return data?.campaign?.headshotPhoto || false;
}

export function runningFor(app) {
  let { data } = app;
  if (data && typeof data === 'string') {
    data = JSON.parse(data);
  }
  if (data?.campaign && data.campaign['running for']) {
    return `Running for ${data.campaign['running for']}`;
  }
  return 'No office specified';
}
