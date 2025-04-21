import { JsonLd } from 'react-schemaorg'
import { APP_BASE } from 'appEnv'
import { PositionLevel } from '../../../shared/PositionLevel'

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
  if (positionLevel?.toUpperCase() === PositionLevel.LOCAL) {
    locStr += `, ${state?.toUpperCase() || ''}`
  }
  if (positionLevel?.toUpperCase() === PositionLevel.CITY) {
    locStr += ` City, ${state}`
  } else if (positionLevel?.toUpperCase() === PositionLevel.COUNTY) {
    locStr += ` County, ${state}`
  }
  const slug = `elections/position/${loc.join('/')}`
  const url = `${APP_BASE}/${slug}`
  const zipCode = filingOfficeAddress?.match(/\b\d{5}(?:-\d{4})?\b/)?.[0] || ''

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
            addressLocality: Place?.name || '',
            addressRegion: state,
            addressCountry: 'US',
            streetAddress: filingOfficeAddress || '',
            postalCode: zipCode,
            telephone: filingPhoneNumber,
          },
        },
        employmentType: employmentType || 'FULL_TIME',
        validThrough: electionDate,
        baseSalary: {
          '@type': 'MonetaryAmount',
          value: {
            '@type': 'QuantitativeValue',
            value: parseInt(salary?.match(/\d+/g)?.[0] || '0'),
            unitText: 'YEAR',
          },
          currency: 'USD',
        },
        eligibilityToWorkRequirement: eligibilityRequirements,
        url,
      }}
    />
  )
}
