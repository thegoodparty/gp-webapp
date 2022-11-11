import { Lato } from '@next/font/google';
import PageWrapper from './shared/layouts/PageWrapper';
import './globals.css';

const lato = Lato({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={lato.className}>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0"
        ></meta>
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <meta property="og:site_name" content="GOOD PARTY" />
        <meta property="og:type" content="website" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#ffffff" />
        <meta property="fb:app_id" content="241239336921963" />
        <meta
          name="facebook-domain-verification"
          content="i5q7j6fwuhlvi1o263gskurwzqqzbb"
        />
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
        {/* <script src="https://www.googleoptimize.com/optimize.js?id=OPT-WLTK9ST"></script> */}
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
    </html>
  );
}
