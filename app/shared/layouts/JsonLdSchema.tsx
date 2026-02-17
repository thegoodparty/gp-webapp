import { JsonLd } from 'react-schemaorg'

const JsonLdSchema = (): React.JSX.Element => {
  return (
    <JsonLd
      item={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'GoodParty.org',
        legalName: 'Good Party LLC',
        url: 'https://goodparty.org',
        logo: 'https://goodparty.org/images/black-logo.svg',
        foundingDate: '2017',
        founders: [
          {
            '@type': 'Person',
            name: 'Farhad Mohit',
          },
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'ask@goodparty.org',
        },
        sameAs: [
          'https://www.facebook.com/goodpartyorg',
          'https://twitter.com/goodpartyorg',
          'https://www.instagram.com/goodpartyorg/',
          'https://www.tiktok.com/@goodparty',
        ],
      }}
    />
  )
}

export default JsonLdSchema
