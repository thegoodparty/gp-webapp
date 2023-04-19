/* eslint-disable @next/next/no-sync-scripts */
import { Lato } from '@next/font/google';
import Script from 'next/script';

import PageWrapper from './shared/layouts/PageWrapper';
import './globals.css';
import { appBase, isProd } from 'gpApi';

const lato = Lato({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
});

export const metadata = {
  applicationName: 'GoodParty',
  metadataBase: new URL(appBase),
};

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
        <meta property="og:site_name" content="GOOD PARTY" />
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
        <script src="https://www.googleoptimize.com/optimize.js?id=OPT-WLTK9ST"></script>
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
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        id="usersnap"
        dangerouslySetInnerHTML={{
          __html: `
        // usersnap.com
        window.onUsersnapLoad = function(api) {
          api.init();
        }
        var script = document.createElement('script');
        script.defer = 1;
        script.src = 'https://widget.usersnap.com/global/load/ffda1fce-d2f7-4471-b118-050ae883436b?onload=onUsersnapLoad';
        document.getElementsByTagName('head')[0].appendChild(script);
        `,
        }}
      />
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        id="fullstory"
        dangerouslySetInnerHTML={{
          __html: `
        if(window.location.hostname === 'goodparty.org'){
          window['_fs_host'] = 'fullstory.com';
          window['_fs_script'] = 'edge.fullstory.com/s/fs.js';
          window['_fs_org'] = 'TBEDP';
          window['_fs_namespace'] = 'FS';
          (function(m,n,e,t,l,o,g,y){
              if (e in m) {if(m.console && m.console.log) { m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');} return;}
              g=m[e]=function(a,b,s){g.q?g.q.push([a,b,s]):g._api(a,b,s);};g.q=[];
              o=n.createElement(t);o.async=1;o.crossOrigin='anonymous';o.src='https://'+_fs_script;
              y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
              g.identify=function(i,v,s){g(l,{uid:i},s);if(v)g(l,v,s)};g.setUserVars=function(v,s){g(l,v,s)};g.event=function(i,v,s){g('event',{n:i,p:v},s)};
              g.anonymize=function(){g.identify(!!0)};
              g.shutdown=function(){g("rec",!1)};g.restart=function(){g("rec",!0)};
              g.log = function(a,b){g("log",[a,b])};
              g.consent=function(a){g("consent",!arguments.length||a)};
              g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
              g.clearUserCookie=function(){};
              g.setVars=function(n, p){g('setVars',[n,p]);};
              g._w={};y='XMLHttpRequest';g._w[y]=m[y];y='fetch';g._w[y]=m[y];
              if(m[y])m[y]=function(){return g._w[y].apply(this,arguments)};
              g._v="1.3.0";
          })(window,document,window['_fs_namespace'],'script','user');
        }
        `,
        }}
      />
    </html>
  );
}
