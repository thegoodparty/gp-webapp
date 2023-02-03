if (!self.define) {
  let e,
    s = {};
  const a = (a, i) => (
    (a = new URL(a + '.js', i).href),
    s[a] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script');
          (e.src = a), (e.onload = s), document.head.appendChild(e);
        } else (e = a), importScripts(a), s();
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (i, n) => {
    const c =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href;
    if (s[c]) return;
    let r = {};
    const t = (e) => a(e, c),
      d = { module: { uri: c }, exports: r, require: t };
    s[c] = Promise.all(i.map((e) => d[e] || t(e))).then((e) => (n(...e), r));
  };
}
define(['./workbox-588899ac'], function (e) {
  'use strict';
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: '/_next/app-build-manifest.json',
          revision: '2a3e18cc979ae2aef2e153fcf1edeecd',
        },
        {
          url: '/_next/static/6VWC7IJwJ1yAqGrQ1rBQs/_buildManifest.js',
          revision: '6cf87bde41defd5c4533f947d0608dba',
        },
        {
          url: '/_next/static/6VWC7IJwJ1yAqGrQ1rBQs/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        {
          url: '/_next/static/chunks/0c428ae2-8081985660b712ef.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/1039-7811cb229c5ee815.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/1148-56eb3e86dbf383a4.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/1181-6dd0adc9148554f4.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/1290.6413295863f929fb.js',
          revision: '6413295863f929fb',
        },
        {
          url: '/_next/static/chunks/1405-21b691fd24a8db8c.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/1568-9396e40dfcefcf41.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/17-668e9207e66304f9.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/1818-8fa81c838c00153b.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/1bfc9850-0c9e9a5e413d11c8.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/2086-d4df966124698fcd.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/2307-445870c5d072f648.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/2919-b8e304a5c7e09d8f.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/30-423d8d26d4815e80.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/315-bc55aedccd21dfb2.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/31664189-d10e5b4e6e1a354d.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/3301-eab33210c2f05a86.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/3323-5ebf956d23adaf44.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/3898-35ab62ef70193669.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/4090-414f07b201ad7623.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/4118-f58576e245a39386.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/4808.3049c307d9f7d056.js',
          revision: '3049c307d9f7d056',
        },
        {
          url: '/_next/static/chunks/5172-4e7fa61a5e09588b.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/5247-8bcaab6d3c273027.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/5501.db9fa7913385a231.js',
          revision: 'db9fa7913385a231',
        },
        {
          url: '/_next/static/chunks/5532-73941b291c872938.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/5619.ee8c96c84ffd7b37.js',
          revision: 'ee8c96c84ffd7b37',
        },
        {
          url: '/_next/static/chunks/5759-0a5744147f0c5f0e.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/5774.2cdae0226b1e62a2.js',
          revision: '2cdae0226b1e62a2',
        },
        {
          url: '/_next/static/chunks/5958.0c3644aa512d6391.js',
          revision: '0c3644aa512d6391',
        },
        {
          url: '/_next/static/chunks/6058-fcfd131aac255dfb.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/618-fdbe9de798bec670.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/6560-34806d1eadf0a241.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/672-5c909b1306aff73c.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/6866-27c9b91a1ff856cb.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/6878-c7fc161c3c9d4010.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/6913-23abe128f56f97b0.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/6992-ce39aa52fbbc680b.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/7169-488be5c4b5b4ce84.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/717-b2ff6e6fbf8dbf62.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/7461.18c902a269b0d598.js',
          revision: '18c902a269b0d598',
        },
        {
          url: '/_next/static/chunks/7593-2005ec27114f2949.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/7727-1db08973f010e137.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/78e521c3-4fe6e9901568cce7.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/8035.feba8a7bcd18356f.js',
          revision: 'feba8a7bcd18356f',
        },
        {
          url: '/_next/static/chunks/818-26cf4e7c43013600.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/8286-0492d8cba7eb65a5.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/8342-d14ca9a5cec977df.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/8380.97cbdeabbfe09e7f.js',
          revision: '97cbdeabbfe09e7f',
        },
        {
          url: '/_next/static/chunks/8605-a1331084686dff6d.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/8983-5d8321bff5040f1d.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/907-68f197f52a1fcef5.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/9258-c26f8bdefce08399.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/9375-0fb548300bf20e44.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/9411-7c5718346d5f61dd.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/9453.a1f5ac1716f59d4c.js',
          revision: 'a1f5ac1716f59d4c',
        },
        {
          url: '/_next/static/chunks/95b64a6e-6b36af4fa5d4aaa5.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/9617.8c660728ac59dca9.js',
          revision: '8c660728ac59dca9',
        },
        {
          url: '/_next/static/chunks/9623.664ecf0fcee721a9.js',
          revision: '664ecf0fcee721a9',
        },
        {
          url: '/_next/static/chunks/9719.27c53a134a820376.js',
          revision: '27c53a134a820376',
        },
        {
          url: '/_next/static/chunks/9768.b2783316b7b7122d.js',
          revision: 'b2783316b7b7122d',
        },
        {
          url: '/_next/static/chunks/9787-d6c84848bb04d550.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/9828-13169d86eb159a47.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/admin/head-31be86cf0fee0a76.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/admin/page-5861f8b659bf5c2f.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/edit-campaign/head-d1ecf8d6f8cab4b9.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/edit-campaign/page-7f0f33e4b3c485d2.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/endorsements/head-48349c50ad154eb1.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/endorsements/page-6ec9040184a75e00.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/head-817ba04172e4d028.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/page-20490e5fb9b1c719.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/top-issues/head-6cb2b9368319d27a.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/top-issues/page-1e9e394ca7846aab.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/goals/about-opponent/head-d813cca00e9d5c90.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/goals/about-opponent/page-3e750c7e26ed785f.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/goals/more-info/head-4ba64817988123da.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/goals/more-info/page-f9056735578947eb.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/goals/opponent-self/head-4a34cc0e946d5137.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/goals/opponent-self/page-5979b55e12994db6.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/goals/opponent/head-c79c0a08249f7b93.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/goals/opponent/page-72b947e46d2815c9.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/goals/what/head-baf80c040fad5337.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/goals/what/page-2968006d442adb27.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/goals/why/head-f9041d76ebd23eee.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/goals/why/page-e72e237d9c0a170c.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/pledge/head-ce255ed42be8aac2.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/pledge/page-62ee72c454ec7602.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/strategy/who-are-you/head-b89eeece727759da.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/strategy/who-are-you/page-180d9f16ab0a7382.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/onboarding/ai/head-802702eff08f3cac.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/onboarding/ai/page-70bae8f8b4246bd5.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/onboarding/head-30033890398a2535.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/onboarding/page-e218103afe16c873.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(company)/about/error-956b45007414be8d.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(company)/about/head-4c49dae5df20482e.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(company)/about/page-5277ff83d9f8ff12.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(company)/contact/head-ffe60d00dd4eb71d.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(company)/contact/page-a4a670c46d657389.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(company)/manifesto/head-80ffd153ad17ff4d.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(company)/manifesto/page-eace69af63f684a0.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(company)/pricing/head-3ce5b0563be646b6.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(company)/pricing/page-a7460528454c5143.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(company)/privacy/head-777b7391303cc890.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(company)/privacy/page-430d4bf89c19a0bf.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(company)/run-for-office/head-9a0c21de8c014597.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(company)/run-for-office/page-e66bacd4efc1898c.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(company)/team/error-54f96da6092731af.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(company)/team/head-9ac0b24eb7558a28.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(company)/team/page-cd6cde60d69af9ec.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(company)/work-with-us/head-f6bcc582638eaaf4.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(company)/work-with-us/page-d29c852e3f8b51c0.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/forgot-password/head-0cd54854e0f2918c.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/forgot-password/page-191f60f66e6ee93d.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/login/head-720a0ad67f2916e9.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/login/page-cf056376b87a37e0.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/register/head-9e30a1691347408a.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/register/page-1eb0467ad9eed7a2.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/reset-password/head-1699ce9aaf1aa345.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/reset-password/page-695e0db987e56667.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/twitter-callback/head-ee520bf29c2b70f3.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/twitter-callback/page-c229f6be6ab90cf1.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(user)/profile/error-7463862279e964db.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(user)/profile/head-bb488774223a80c8.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(user)/profile/layout-7aa4f704c4251cfc.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(user)/profile/page-f965817fef9cb2cb.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(user)/profile/settings/head-3b579d81ce1d4d5f.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/(user)/profile/settings/page-c16969a7c1d362e6.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/admin/add-candidate/head-876caf4e43de1c4a.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/admin/add-candidate/page-30139a38de152625.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/admin/candidates/head-1aaee0e6f7c5d574.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/admin/candidates/page-340f5a66ff00318c.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/admin/head-17804df1cb32570d.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/admin/page-e0a81d7145b03922.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/admin/top-issues/head-9c3dc23e6793105a.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/admin/top-issues/page-ba0fb5bf665173e8.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/admin/users/head-72267788677950ef.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/admin/users/page-bff68018017b6a2a.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/blog/article/%5Bslug%5D/head-47b5675f02c13898.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/blog/article/%5Bslug%5D/page-61c54894c1626cf4.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/blog/head-2632846387c36b0a.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/blog/page-811f609609b3b252.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/blog/section/%5Bslug%5D/head-ece385cf9fc4f5f2.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/blog/section/%5Bslug%5D/page-4073eaeb6355d111.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/candidate/%5B...oldSlug%5D/page-d00e37d23321ba20.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/candidate/%5Bslug%5D/head-57698732c15aa4ef.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/candidate/%5Bslug%5D/page-210cd08efe2d8f07.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/candidates/%5B%5B...filters%5D%5D/head-9f95c6adae78ace6.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/candidates/%5B%5B...filters%5D%5D/page-26481fa8b99dead8.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/faqs/%5B...titleId%5D/head-4ed1751f34608b38.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/faqs/%5B...titleId%5D/page-4dae9fea5b98c58e.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/faqs/head-20adf8114b46b5b4.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/faqs/page-23f934cf2dbccfc2.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/head-12ea3f22b549448d.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/layout-8457c5f1683d184f.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/page-07d0b1e2fda07efd.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/political-terms/%5Bslug%5D/head-798c2b3a231e3eac.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/political-terms/%5Bslug%5D/page-6c79fdf221a18e0b.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/political-terms/head-aa3c9ee14f317110.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/app/political-terms/page-9dddc49900d77bfd.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/b98bc7c3-6845e68a01b8fc83.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/d64684d8-39ce0715f2ab046f.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/f70991a6-8d09a24effa6a57e.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/main-5d359c8d98ba4abb.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/main-app-938d202940bc9fa0.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/pages/_app-cbe2c9d1e8e75269.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/pages/_error-7eb2326bfea6ee40.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js',
          revision: '837c0df77fd5009c9e46d446188ecfd0',
        },
        {
          url: '/_next/static/chunks/webpack-421b403fa44fde20.js',
          revision: '6VWC7IJwJ1yAqGrQ1rBQs',
        },
        {
          url: '/_next/static/css/0066814787c03d95.css',
          revision: '0066814787c03d95',
        },
        {
          url: '/_next/static/css/08f3171ea9aca7c4.css',
          revision: '08f3171ea9aca7c4',
        },
        {
          url: '/_next/static/css/1101abea72c71778.css',
          revision: '1101abea72c71778',
        },
        {
          url: '/_next/static/css/16d7bfb39aa9a2eb.css',
          revision: '16d7bfb39aa9a2eb',
        },
        {
          url: '/_next/static/css/1815c20a37e59b58.css',
          revision: '1815c20a37e59b58',
        },
        {
          url: '/_next/static/css/2610287f37dc56be.css',
          revision: '2610287f37dc56be',
        },
        {
          url: '/_next/static/css/340e5f29e09176a7.css',
          revision: '340e5f29e09176a7',
        },
        {
          url: '/_next/static/css/34379bcbbbe02add.css',
          revision: '34379bcbbbe02add',
        },
        {
          url: '/_next/static/css/3b062c2d58e4ff3e.css',
          revision: '3b062c2d58e4ff3e',
        },
        {
          url: '/_next/static/css/3f822dc58e4bffbe.css',
          revision: '3f822dc58e4bffbe',
        },
        {
          url: '/_next/static/css/5055336e6c0f9207.css',
          revision: '5055336e6c0f9207',
        },
        {
          url: '/_next/static/css/566c7bd3b58496f8.css',
          revision: '566c7bd3b58496f8',
        },
        {
          url: '/_next/static/css/5ccd422c581bc571.css',
          revision: '5ccd422c581bc571',
        },
        {
          url: '/_next/static/css/6490b1291f7822d7.css',
          revision: '6490b1291f7822d7',
        },
        {
          url: '/_next/static/css/854b6314a7426e59.css',
          revision: '854b6314a7426e59',
        },
        {
          url: '/_next/static/css/9b90fe812ff8f9b7.css',
          revision: '9b90fe812ff8f9b7',
        },
        {
          url: '/_next/static/css/b140b2b33ba82afc.css',
          revision: 'b140b2b33ba82afc',
        },
        {
          url: '/_next/static/css/b29243add46305f0.css',
          revision: 'b29243add46305f0',
        },
        {
          url: '/_next/static/css/b440165c0049c3e1.css',
          revision: 'b440165c0049c3e1',
        },
        {
          url: '/_next/static/css/b8e31c6b10a064f8.css',
          revision: 'b8e31c6b10a064f8',
        },
        {
          url: '/_next/static/css/c9538334b4637d87.css',
          revision: 'c9538334b4637d87',
        },
        {
          url: '/_next/static/css/cad1ce54bdf09886.css',
          revision: 'cad1ce54bdf09886',
        },
        {
          url: '/_next/static/css/cbc4686497573fea.css',
          revision: 'cbc4686497573fea',
        },
        {
          url: '/_next/static/css/d28848d0a0a7c9f3.css',
          revision: 'd28848d0a0a7c9f3',
        },
        {
          url: '/_next/static/css/d4305cdbd3882895.css',
          revision: 'd4305cdbd3882895',
        },
        {
          url: '/_next/static/css/eecd59313114b646.css',
          revision: 'eecd59313114b646',
        },
        {
          url: '/_next/static/media/1502bd213e25ba3e.woff2',
          revision: 'a9c7c20a417a34a9d017176b563cfb64',
        },
        {
          url: '/_next/static/media/28777f2d837b799c.p.woff2',
          revision: 'e7e52c955aa33e618baf437a16539524',
        },
        {
          url: '/_next/static/media/400b60eed27dfb33.p.woff2',
          revision: '69b28056044be6438ce7e5214c66ba82',
        },
        {
          url: '/_next/static/media/633da1f25676cae8.woff2',
          revision: '5bc5e06e2c36c36d2afbb4321dfc8697',
        },
        {
          url: '/_next/static/media/7bb39e817a36d930.p.woff2',
          revision: '89516c332e4454cfd3caa1b52cea919b',
        },
        {
          url: '/_next/static/media/880988045e8ce30f.p.woff2',
          revision: '5589842cc46587294240b2cc0c7a0f98',
        },
        {
          url: '/_next/static/media/9626065e32893d49.woff2',
          revision: 'f0f8f93fabb6ff890ec4603e72d551f8',
        },
        {
          url: '/_next/static/media/ajax-loader.0b80f665.gif',
          revision: '0b80f665',
        },
        {
          url: '/_next/static/media/banner-bg-1.4d3b145a.png',
          revision: '1163783fa052e7b4507c48e5a2b741dc',
        },
        {
          url: '/_next/static/media/dd7e11d97e6f9605.woff2',
          revision: '09032bab78b9b7fca9b00427ae4083f0',
        },
        {
          url: '/_next/static/media/expert-small.55d21594.png',
          revision: '3da68ff3c349e0c8ab05809dff497cd9',
        },
        {
          url: '/_next/static/media/expert.7411ad3f.png',
          revision: '55cd46c3cb268dce911ac36466887ba3',
        },
        {
          url: '/_next/static/media/faq-hero.db04c1bf.jpeg',
          revision: 'ac3ed1e7ffbec3e025d77008c6138f21',
        },
        {
          url: '/_next/static/media/hero-bg.3b195183.png',
          revision: '758007bf6ef717dadfbe1d2297912953',
        },
        {
          url: '/_next/static/media/homepage-candidates.6817135d.png',
          revision: '57613eaca06fb35665aba60309442628',
        },
        {
          url: '/_next/static/media/homepage-voters.2056a33a.png',
          revision: 'cc0f984987731c2147a3df9c25740e00',
        },
        {
          url: '/_next/static/media/people.e75cbf41.png',
          revision: 'a01ed6e235205ad8f1293beb2e3023b1',
        },
        {
          url: '/_next/static/media/red-bg-small.ec6cdc49.png',
          revision: '0a4b61d4fa382d6ee176cca8303a8c93',
        },
        {
          url: '/_next/static/media/red-bg.0e678779.png',
          revision: 'acb01ee1b137e1a92ae85a96fa969335',
        },
        { url: '/_next/static/media/slick.25572f22.eot', revision: '25572f22' },
        {
          url: '/_next/static/media/slick.653a4cbb.woff',
          revision: '653a4cbb',
        },
        { url: '/_next/static/media/slick.6aa1ee46.ttf', revision: '6aa1ee46' },
        { url: '/_next/static/media/slick.f895cfdf.svg', revision: 'f895cfdf' },
        {
          url: '/_next/static/media/team.0d008a5e.png',
          revision: '8ce12b300de972305373a2844e21aa9d',
        },
        {
          url: '/_next/static/media/volunteer.16f2f0a7.png',
          revision: '9686dfbf92e49af23a457e0e0d37479d',
        },
        {
          url: '/_next/static/media/your-name.fa9d97fe.jpg',
          revision: 'a59176edf74a54dca946b55a5357d7fe',
        },
        { url: '/favicon.ico', revision: '802717f7b2a0c5379133a794cded7c8c' },
        {
          url: '/images/black-logo.svg',
          revision: '8b1420010774a47267eb29cced8ed21b',
        },
        {
          url: '/images/certified-black.svg',
          revision: 'df7dba2305b27a5f147b052190f136e7',
        },
        {
          url: '/images/faqs/faq-hero.jpeg',
          revision: 'ac3ed1e7ffbec3e025d77008c6138f21',
        },
        {
          url: '/images/favicons/android-icon-144x144.png',
          revision: '93c519b9432f7e25b9a507cb71a75f1d',
        },
        {
          url: '/images/favicons/android-icon-192x192.png',
          revision: 'ea26bf93e041c00df8c564630e38ee0b',
        },
        {
          url: '/images/favicons/android-icon-36x36.png',
          revision: 'd855376dd1d584cbdca93633b674a1dc',
        },
        {
          url: '/images/favicons/android-icon-48x48.png',
          revision: 'f40a9145a527a2957d1923e62d9035e4',
        },
        {
          url: '/images/favicons/android-icon-72x72.png',
          revision: 'b3ebf8a83309b2a96de55c0f7980ce87',
        },
        {
          url: '/images/favicons/android-icon-96x96.png',
          revision: '0d09a5977fe2e993e19fc40a2c71aa6d',
        },
        {
          url: '/images/favicons/apple-icon-114x114.png',
          revision: 'f75a4f0416d828476fd26da2b3a450a4',
        },
        {
          url: '/images/favicons/apple-icon-120x120.png',
          revision: 'c9b11aaacb3ca30fa10cb8338a1eb3f6',
        },
        {
          url: '/images/favicons/apple-icon-144x144.png',
          revision: '93c519b9432f7e25b9a507cb71a75f1d',
        },
        {
          url: '/images/favicons/apple-icon-152x152.png',
          revision: '77831c594e767d5ff3a5e7e8573b4d56',
        },
        {
          url: '/images/favicons/apple-icon-180x180.png',
          revision: '562a4ddb31ba31950e09d1d77a47d8ce',
        },
        {
          url: '/images/favicons/apple-icon-57x57.png',
          revision: 'b775a636e5e31a2b0ffbe41293ef04c5',
        },
        {
          url: '/images/favicons/apple-icon-60x60.png',
          revision: 'b183026c2b02fcc579ac8219d75423df',
        },
        {
          url: '/images/favicons/apple-icon-72x72.png',
          revision: 'b3ebf8a83309b2a96de55c0f7980ce87',
        },
        {
          url: '/images/favicons/apple-icon-76x76.png',
          revision: '69c9b9b541a45589a3966b7098e49ce5',
        },
        {
          url: '/images/favicons/apple-icon-precomposed.png',
          revision: '2accdcd14ef43c617e3e8a6fd220cc33',
        },
        {
          url: '/images/favicons/apple-icon.png',
          revision: '2accdcd14ef43c617e3e8a6fd220cc33',
        },
        {
          url: '/images/favicons/browserconfig.xml',
          revision: '653d077300a12f09a69caeea7a8947f8',
        },
        {
          url: '/images/favicons/favicon-16x16.png',
          revision: '22e666e753d89f71025d392ca737149c',
        },
        {
          url: '/images/favicons/favicon-32x32.png',
          revision: '59a43323aa6f5c8bcebc22858fd8844b',
        },
        {
          url: '/images/favicons/favicon-512x512.png',
          revision: 'f9c7b4377573f49892338c58f8fcbde4',
        },
        {
          url: '/images/favicons/favicon-96x96.png',
          revision: '0d09a5977fe2e993e19fc40a2c71aa6d',
        },
        {
          url: '/images/favicons/favicon.ico',
          revision: '802717f7b2a0c5379133a794cded7c8c',
        },
        {
          url: '/images/favicons/ms-icon-144x144.png',
          revision: '93c519b9432f7e25b9a507cb71a75f1d',
        },
        {
          url: '/images/favicons/ms-icon-150x150.png',
          revision: 'b09b866f516b8c4f1893d3552594966b',
        },
        {
          url: '/images/favicons/ms-icon-310x310.png',
          revision: '3555c694e6026e44d7ec2bb5510493ea',
        },
        {
          url: '/images/favicons/ms-icon-70x70.png',
          revision: '1d7058a53a9e078e878f1b29bdb84873',
        },
        {
          url: '/images/heart.svg',
          revision: 'afb811998bad9271de9f195d6b0bf57f',
        },
        {
          url: '/images/homepage-jan23/homepage-candidates.png',
          revision: '57613eaca06fb35665aba60309442628',
        },
        {
          url: '/images/homepage-jan23/homepage-voters.png',
          revision: 'cc0f984987731c2147a3df9c25740e00',
        },
        {
          url: '/images/homepage-jan23/team.png',
          revision: '8ce12b300de972305373a2844e21aa9d',
        },
        {
          url: '/images/homepage-jan23/volunteer.png',
          revision: '9686dfbf92e49af23a457e0e0d37479d',
        },
        {
          url: '/images/homepage-jan23/your-name.jpg',
          revision: 'a59176edf74a54dca946b55a5357d7fe',
        },
        {
          url: '/images/homepage/banner-bg-1.png',
          revision: '1163783fa052e7b4507c48e5a2b741dc',
        },
        {
          url: '/images/homepage/declare-independence.png',
          revision: '862779258fba896a2d8076aa96a8fbbd',
        },
        {
          url: '/images/homepage/tiktok-preview-sm.jpg',
          revision: '2bf212832e3360cf2f4d950fa92dba15',
        },
        {
          url: '/images/icons/achievement.svg',
          revision: '82f9ec0f71b0f154df813def47bedd13',
        },
        {
          url: '/images/landing-pages/expert-small.png',
          revision: '3da68ff3c349e0c8ab05809dff497cd9',
        },
        {
          url: '/images/landing-pages/expert.png',
          revision: '55cd46c3cb268dce911ac36466887ba3',
        },
        {
          url: '/images/landing-pages/hero-bg.png',
          revision: '758007bf6ef717dadfbe1d2297912953',
        },
        {
          url: '/images/landing-pages/people.png',
          revision: 'a01ed6e235205ad8f1293beb2e3023b1',
        },
        {
          url: '/images/landing-pages/red-bg-small.png',
          revision: '0a4b61d4fa382d6ee176cca8303a8c93',
        },
        {
          url: '/images/landing-pages/red-bg.png',
          revision: 'acb01ee1b137e1a92ae85a96fa969335',
        },
        { url: '/manifest.json', revision: '82835d3211b2cd209c04c2fbb2e56fe6' },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: a,
              state: i,
            }) =>
              s && 'opaqueredirect' === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: 'OK',
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith('/api/auth/') && !!s.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      'GET',
    );
});
