import React from 'react'
import { JsonLd } from 'react-schemaorg'

import { cmsToPlainText } from 'helpers/contentfulHelper'
import { Document } from '@contentful/rich-text-types'

interface DefinedTermSchemaProps {
  item: {
    title: string
    description: Document
  }
  slug: string
}

export default function DefinedTermSchema({ item, slug }: DefinedTermSchemaProps): React.JSX.Element {
  const { title, description } = item

  return (
    <JsonLd
      item={{
        '@context': 'https://schema.org',
        '@type': 'DefinedTerm',
        description: cmsToPlainText(description),
        name: title,
        mainEntityOfPage: title,
        url: `https://goodparty.org/political-terms/${slug}`,
      }}
    />
  )
}
