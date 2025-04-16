import { JsonLd } from 'react-schemaorg'
import { APP_BASE } from 'appEnv'

export default function PositionSchema({ race, loc }) {
  const {
    positionLevel,
    normalizedPositionName,
    positionDescription,
    Place,
    electionDate,
    eligibilityRequirements,
    state,
    salary,
    employmentType,
    filingOfficeAddress,
    filingPhoneNumber,
    filingDateEnd,
  } = race
  let locStr = Place?.name || ''
  if (positionLevel?.toLowerCase() === 'local') {
    locStr += `, ${state?.toUpperCase() || ''}`
  }
  if (positionLevel?.toLowerCase() === 'city') {
    locStr += ` City, ${state}`
  } else if (positionLevel?.toLowerCase() === 'county') {
    locStr += ` County, ${state}`
  }
  const slug = `elections/position/${loc.join('/')}`
  const url = `${APP_BASE}/${slug}`
  const baseSalary = salary ? `${salary.match(/\d+/g)}` : 'Not Specified'

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
            addressLocality: Place?.name,
            addressRegion: state,
            telephone: filingPhoneNumber,
          },
        },
        employmentType: 'Elected',
        validThrough: electionDate,
        baseSalary: baseSalary,
        estimatedSalary: baseSalary,
        eligibilityToWorkRequirement: eligibilityRequirements,
        employmentType,
        url,
      }}
    />
  )
}
