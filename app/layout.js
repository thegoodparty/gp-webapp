import { Outfit } from 'next/font/google'
import localFont from 'next/font/local'
import Script from 'next/script'
import { Suspense } from 'react'
import PageWrapper from './shared/layouts/PageWrapper'
import './globals.css'
import VwoScript from '@shared/scripts/VwoScript'
import { APP_BASE, IS_PROD } from 'appEnv'
import RouteTracker from '@shared/scripts/RouteTrackerScript'
import AmplitudeInit from '@shared/AmplitudeInit'
import AnalyticsSessionReplayMiddleware from '@shared/AnalyticsSessionReplayMiddleware'
import { FeatureFlagsProvider } from '@shared/experiments/FeatureFlagsProvider'
import { ReactQueryProvider } from '@shared/query-client'

const outfit = Outfit({ subsets: ['latin'], variable: '--outfit-font' })

const sfPro = localFont({
  subsets: ['latin'],
  src: [
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
  ],
  formatHint: 'woff2',
  variable: '--sfpro-font',
  display: 'swap',
})

export const metadata = {
  applicationName: 'GoodParty',
  metadataBase: new URL(APP_BASE),
  title: 'GoodParty.org | Empowering independents to run, win and serve.',
  description:
    "We're transforming civic leadership with tools and data that empower independents to run, win and serve without needing partisan or big-money support. Join Us!",
}

const RootLayout = ({ children }) => (
  <html lang="en" className={`${outfit.variable} ${sfPro.variable}`}>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta property="og:site_name" content="GoodParty.org" />
      <meta property="og:type" content="website" />

      <meta property="twitter:card" content="summary_large_image" />
      <meta name="theme-color" content="#ffffff" />
      <meta property="fb:app_id" content="241239336921963" />
      {!IS_PROD && <meta name="robots" content="noindex" />}
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
      <VwoScript />

      <Script strategy="afterInteractive" id="gtm">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-M53W2ZV');
        `}
      </Script>
    </head>
    <body>
      <Suspense>
        <RouteTracker />
      </Suspense>
      <AnalyticsSessionReplayMiddleware />
      <AmplitudeInit />
      <ReactQueryProvider>
        <FeatureFlagsProvider>
          <PageWrapper>{children}</PageWrapper>
        </FeatureFlagsProvider>
      </ReactQueryProvider>
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
      type="text/javascript"
      id="hs-script-loader"
      strategy="afterInteractive"
      src="//js.hs-scripts.com/21589597.js"
    />
  </html>
)
export default RootLayout
