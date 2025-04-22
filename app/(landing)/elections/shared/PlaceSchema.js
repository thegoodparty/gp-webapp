import { JsonLd } from 'react-schemaorg'
import { APP_BASE } from 'appEnv'

export default function PlaceSchema({ place }) {
  const {
    name,
    slug,
    geoId,
    state,
    cityLargest,
    countyName,
    population,
    density,
    incomeHouseholdMedian,
    unemploymentRate,
    homeValue,
    parent,
  } = place || {}

  const url = `${APP_BASE}/${slug}`

  // Create additional properties array only with non-null values
  const additionalProperties = []
  if (population != null) {
    additionalProperties.push({
      '@type': 'PropertyValue',
      name: 'population',
      value: population,
    })
  }
  if (density != null) {
    additionalProperties.push({
      '@type': 'PropertyValue',
      name: 'density',
      value: density,
    })
  }
  if (incomeHouseholdMedian != null) {
    additionalProperties.push({
      '@type': 'PropertyValue',
      name: 'medianHouseholdIncome',
      value: incomeHouseholdMedian,
    })
  }
  if (unemploymentRate != null) {
    additionalProperties.push({
      '@type': 'PropertyValue',
      name: 'unemploymentRate',
      value: unemploymentRate,
    })
  }
  if (homeValue != null) {
    additionalProperties.push({
      '@type': 'PropertyValue',
      name: 'medianHomeValue',
      value: homeValue,
    })
  }

  return (
    <JsonLd
      item={{
        '@context': 'https://schema.org',
        '@type': 'Place',
        '@id': `https://goodparty.org/elections/${slug}`,
        name: name,
        identifier: geoId,
        containedInPlace: parent
          ? {
              '@type': 'Place',
              name: parent.name,
              identifier: parent.geoId,
              addressRegion: parent.state,
            }
          : undefined,
        ...(additionalProperties.length > 0 && {
          additionalProperty: additionalProperties,
        }),
        address: {
          '@type': 'PostalAddress',
          addressRegion: state,
          addressLocality: cityLargest,
          name: countyName,
        },
        url,
      }}
    />
  )
}
