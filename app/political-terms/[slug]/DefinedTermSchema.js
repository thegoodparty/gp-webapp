import React from 'react'
import { JsonLd } from 'react-schemaorg'

import { cmsToPlainText } from 'helpers/contentfulHelper'

export default function DefinedTermSchema({ item, slug }) {
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
