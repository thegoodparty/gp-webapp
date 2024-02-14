import { appBase } from 'gpApi';
import { slugify } from 'helpers/articleHelper';
import React from 'react';
import { JsonLd } from 'react-schemaorg';

export default function PositionSchema({ race }) {
  const {
    level,
    positionName,
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
  let loc = locationName;
  if (level === 'city') {
    loc += ` City, ${race.state}`;
  } else if (level === 'county') {
    loc += ` County, ${race.state}`;
  } else if (level === 'state') {
    loc += ` ${race.state}`;
  }
  const slug = slugify(positionName, true);
  const url = `${appBase}/elections/${slug}/${race.hashId}/`;
  const baseSalary = `${salary?.match(/\d+/g)}` || 'Not Specified';

  return (
    <JsonLd
      item={{
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        datePosted: '2024-01-01',
        validThrough: filingDateEnd,
        title: positionName,
        name: positionName,
        description: positionDescription,
        hiringOrganization: {
          '@type': 'Organization',
          name: loc,
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
