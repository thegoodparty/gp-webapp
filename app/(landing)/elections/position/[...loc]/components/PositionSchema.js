import { JsonLd } from 'react-schemaorg';
import { APP_BASE } from 'appEnv';

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
    municipality,
  } = race;
  let locStr = locationName;
  if (level === 'local') {
    locStr += `${municipality?.name}, ${state?.toUpperCase() || ''}`;
  }
  if (level === 'city') {
    locStr += ` City, ${state}`;
  } else if (level === 'county') {
    locStr += ` County, ${race.state}`;
  } else if (level === 'state') {
    locStr += ` ${state}`;
  }
  const slug = `elections/position/${loc.join('/')}`;
  const url = `${APP_BASE}/${slug}`;
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
