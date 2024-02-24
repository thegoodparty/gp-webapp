import { appBase } from 'gpApi';
import { slugify } from 'helpers/articleHelper';
import React from 'react';
import { JsonLd } from 'react-schemaorg';

export default function PositionSchema({ race, loc }) {
  const {
    level,
    normalizedPositionName,
    positionDescription,
    locationName,
    electionDay,
    eligibilityRequirements,
    state,
    salary,
    employmentType,
    filingOfficeAddress,
    filingPhoneNumber,
    filingDateEnd,
  } = race;
  let locStr = locationName;
  if (level === 'city') {
    locStr += ` City, ${race.state}`;
  } else if (level === 'county') {
    locStr += ` County, ${race.state}`;
  } else if (level === 'state') {
    locStr += ` ${race.state}`;
  }
  const slug = `elections/position/${loc.join('/')}`;
  const url = `${appBase}/${slug}`;
  const baseSalary = `${salary?.match(/\d+/g)}` || 'Not Specified';

  return (
    <JsonLd
      item={{
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        datePosted: '2024-01-01',
        validThrough: filingDateEnd,
        title: normalizedPositionName,
        name: normalizedPositionName,
        description: positionDescription,
        hiringOrganization: {
          '@type': 'Organization',
          name: locStr,
          location: filingOfficeAddress,
        },
        jobLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: locationName,
            addressRegion: state,
            telephone: filingPhoneNumber,
          },
        },
        employmentType: 'Elected',
        validThrough: electionDay,
        baseSalary: baseSalary,
        estimatedSalary: baseSalary,
        eligibilityToWorkRequirement: eligibilityRequirements,
        employmentType,

        url,
      }}
    />
  );
}
