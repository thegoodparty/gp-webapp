/**
 *
 * TgpHelmet
 *
 */

import React, { useContext } from 'react';
// import { useRouter } from 'next/router';
import { jsonLdScriptProps } from 'react-schemaorg';
import { AppContext } from '../layouts/PageWrapper';

// import apiHelper from '/helpers/apiHelper';
// const { base } = apiHelper;

function TgpHelmet({ title, ogTitle, description, image }) {
  const { APP_BASE } = useContext(AppContext);
  console.log('APP_BASE', APP_BASE);
  // const router = useRouter();
  // const { query, pathname } = router;
  // const url = `${base}${router.asPath}`;
  // let canonical = url;
  // if (query) {
  //   // let queryString = '?';
  //   const keys = Object.keys(query);
  //   keys.forEach((key) => {
  //     const queryString = `${key}=${query[key]}`;
  //     canonical = canonical.replace(queryString, '');
  //   });
  //   canonical = canonical.replace('?', '');
  // }
  return (
    <head>
      {title && <title data-cy="page-title">{title}</title>}
      {title && <meta property="og:title" content={ogTitle || title} />}
      {/* <meta property="og:url" content={url} /> */}
      {/* {APP_BASE !== 'https://goodparty.org' && (
        <meta name="robots" content="noindex" />
      )} */}
      {/* <link rel="canonical" href={canonical} /> */}
      {description && (
        <meta
          name="description"
          data-cy="page-description"
          content={description}
        />
      )}
      {description && <meta property="og:description" content={description} />}
      {image ? (
        <meta property="og:image" content={image} />
      ) : (
        <meta
          property="og:image"
          content="https://assets.goodparty.org/share.jpg"
        />
      )}
      <link
        rel="icon"
        type="image/png"
        href="https://assets.goodparty.org/favicon.png"
      />
      <script
        {...jsonLdScriptProps({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Good Party',
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
        })}
      />
    </head>
  );
}

export default TgpHelmet;
