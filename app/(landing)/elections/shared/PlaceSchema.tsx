import { JsonLd } from 'react-schemaorg'
import { APP_BASE } from 'appEnv'
import { Place } from './types'
import { Place as SchemaPlace, WithContext } from 'schema-dts'

interface PlaceSchemaProps {
  place: Place
}

const PlaceSchema = ({ place }: PlaceSchemaProps): React.JSX.Element => {
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

  const additionalProperties: Array<{
    '@type': 'PropertyValue'
    name: string
    value: number
  }> = []
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

  const schemaItem: WithContext<SchemaPlace> = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    '@id': `https://goodparty.org/elections/${slug}`,
    name: name,
    identifier: geoId,
    url,
    ...(parent && {
      containedInPlace: {
        '@type': 'Place',
        name: parent.name,
        identifier: parent.geoId,
      },
    }),
    ...(additionalProperties.length > 0 && {
      additionalProperty: additionalProperties,
    }),
    address: {
      '@type': 'PostalAddress',
      addressRegion: state,
      addressLocality: cityLargest,
      name: countyName,
    },
  }

  return <JsonLd item={schemaItem} />
}

export default PlaceSchema
