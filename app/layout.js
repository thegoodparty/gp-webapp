/* eslint-disable @next/next/no-sync-scripts */
import { Outfit } from 'next/font/google';
import localFont from 'next/font/local';
import Script from 'next/script';

import PageWrapper from './shared/layouts/PageWrapper';
import './globals.css';
import { appBase, isProd } from 'gpApi';

const outfit = Outfit({ subsets: ['latin'], variable: '--outfit-font' });

const sfPro = localFont({
  subsets: ['latin'],
  src: [
    // {
    //   path: '../public/fonts/SFProDisplay-Thin.woff2',
    //   weight: '100',
    //   style: 'normal',
    // },
    // {
    //   path: '../public/fonts/SFProDisplay-Ultralight.woff2',
    //   weight: '200',
    //   style: 'normal',
    // },
    {
      path: '../public/fonts/SFProDisplay-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/SFProDisplay-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/SFProDisplay-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/SFProDisplay-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    // {
    //   path: '../public/fonts/SFProDisplay-Bold.woff2',
    //   weight: '700',
    //   style: 'normal',
    // },
  ],
  formatHint: 'woff2',
  variable: '--sfpro-font',
  display: 'swap',
});

export const metadata = {
  applicationName: 'GoodParty',
  metadataBase: new URL(appBase),
  title: 'GOOD PARTY | Free tools to change the rules and disrupt the corrupt.',
  description:
    "Not a political party, we're building tools to change the rules, empowering creatives to mobilize community & disrupt the corrupt two-party system. Join us!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${sfPro.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta property="og:site_name" content="Good Party" />
        <meta property="og:type" content="website" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#ffffff" />
        <meta property="fb:app_id" content="241239336921963" />
        {!isProd && <meta name="robots" content="noindex" />}
        <link
          rel="icon"
          type="image/png"
          href="https://assets.goodparty.org/favicon/favicon-512x512.png"
          sizes="512x512"
        />
        <link
          rel="apple-touch-icon"
          href="https://assets.goodparty.org/favicon/android-icon-192x192.png"
        />

        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <PageWrapper>{children}</PageWrapper>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M53W2ZV"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      </body>
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        id="gtm"
        dangerouslySetInnerHTML={{
          __html: `
        // GTM
        if(window.location.hostname === 'goodparty.org'){
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-M53W2ZV');
         }
        `,
        }}
      />
    </html>
  );
}
