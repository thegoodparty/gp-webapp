if (!self.define) {
  let e,
    a = {};
  const s = (s, c) => (
    (s = new URL(s + '.js', c).href),
    a[s] ||
      new Promise((a) => {
        if ('document' in self) {
          const e = document.createElement('script');
          (e.src = s), (e.onload = a), document.head.appendChild(e);
        } else (e = s), importScripts(s), a();
      }).then(() => {
        let e = a[s];
        if (!e) throw new Error(`Module ${s} didn’t register its module`);
        return e;
      })
  );
  self.define = (c, i) => {
    const t =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href;
    if (a[t]) return;
    let n = {};
    const r = (e) => s(e, t),
      o = { module: { uri: t }, exports: n, require: r };
    a[t] = Promise.all(c.map((e) => o[e] || r(e))).then((e) => (i(...e), n));
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
          revision: '582b1235197d877e73b906e9c7ba506e',
        },
        {
          url: '/_next/static/btcgkER7XmI-awjSP88o0/_buildManifest.js',
          revision: '6cf87bde41defd5c4533f947d0608dba',
        },
        {
          url: '/_next/static/btcgkER7XmI-awjSP88o0/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        {
          url: '/_next/static/chunks/0c428ae2-8081985660b712ef.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/1000-f5411ed2c122b887.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/1070-ad7c291c0afc83bc.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/1148-56eb3e86dbf383a4.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/1243-7424e65f6a5d1faa.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/1290.6413295863f929fb.js',
          revision: '6413295863f929fb',
        },
        {
          url: '/_next/static/chunks/1316-48c705c6d5d9ac7d.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/1405-801d71d22741255d.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/1543-cc206abd3eb9679a.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/1568-9396e40dfcefcf41.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/17-640fd1922b49a820.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/1bfc9850-0c9e9a5e413d11c8.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/2086-54928da46f06e387.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/2148-43b29f38ac8c8e12.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/2951-92510902b97e80a4.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/30-a63d5fc971c339cd.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/31664189-d10e5b4e6e1a354d.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/3998-f83878ad3b0b428c.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/4029.67f420a7aedefd40.js',
          revision: '67f420a7aedefd40',
        },
        {
          url: '/_next/static/chunks/4090-6bed3a3192830814.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/4741-1d1c1870592f34de.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/4808.3049c307d9f7d056.js',
          revision: '3049c307d9f7d056',
        },
        {
          url: '/_next/static/chunks/4861-eac1d39a0058d286.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/5172-4e7fa61a5e09588b.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/5305-737d59205708dc3d.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/5501.db9fa7913385a231.js',
          revision: 'db9fa7913385a231',
        },
        {
          url: '/_next/static/chunks/5619.ee8c96c84ffd7b37.js',
          revision: 'ee8c96c84ffd7b37',
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
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/6653-a70958cfe8d5a3e0.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/672-5c909b1306aff73c.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/7169-6c7d5a2b6bd3d93a.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/717-b2ff6e6fbf8dbf62.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/7248-7350368866f0fa98.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/7373-98185bf5b4f3a05f.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/7461.18c902a269b0d598.js',
          revision: '18c902a269b0d598',
        },
        {
          url: '/_next/static/chunks/7829-042e1247ad0e696b.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/78e521c3-4fe6e9901568cce7.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/8035.feba8a7bcd18356f.js',
          revision: 'feba8a7bcd18356f',
        },
        {
          url: '/_next/static/chunks/8380.97cbdeabbfe09e7f.js',
          revision: '97cbdeabbfe09e7f',
        },
        {
          url: '/_next/static/chunks/8402-ea50d23fb0b03290.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/8605-a1331084686dff6d.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/866.1467c5bfd32aca55.js',
          revision: '1467c5bfd32aca55',
        },
        {
          url: '/_next/static/chunks/9258-c26f8bdefce08399.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/9375-0fb548300bf20e44.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/9411-7c5718346d5f61dd.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/9511-ddeb0f6cf83293a2.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/95b64a6e-6b36af4fa5d4aaa5.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/9617.8c660728ac59dca9.js',
          revision: '8c660728ac59dca9',
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
          url: '/_next/static/chunks/9828-13169d86eb159a47.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/9885-9b4dcac39aa9aed0.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/9900-16d9e17d373cd003.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/admin/head-a0ce5c063622cdeb.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/admin/page-eed36a14d02ff9e0.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/edit-campaign/head-25131060b4b20feb.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/edit-campaign/page-5de7a792a21e35e5.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/endorsements/head-12de4a42b7bde732.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/endorsements/page-7b1be33f199897d4.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/head-964a3e40a06b9886.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/page-0f5ae68c9919b347.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/top-issues/head-92b6a209df85d73a.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/top-issues/page-4cb68998c10de9ed.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/onboarding/head-cc0f754c93af61e5.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/onboarding/page-c2caed20bbdd9266.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(company)/about/error-956b45007414be8d.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(company)/about/head-2048d13f0bc6c5ed.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(company)/about/page-5277ff83d9f8ff12.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(company)/contact/head-b50d1f1282310534.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(company)/contact/page-a4a670c46d657389.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(company)/manifesto/head-b1c4a82b6d1b22e6.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(company)/manifesto/page-f0b9f45b217132d5.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(company)/pricing/head-e4cbadd73daddcb3.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(company)/pricing/page-5addd718cfa14f1a.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(company)/privacy/head-051d9f1368d028c9.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(company)/privacy/page-430d4bf89c19a0bf.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(company)/run-for-office/head-9a0c21de8c014597.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(company)/run-for-office/page-6d1ffa5efeb64a71.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(company)/team/error-54f96da6092731af.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(company)/team/head-36e84811be934344.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(company)/team/page-cd6cde60d69af9ec.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(company)/work-with-us/head-5784f1c566b28ff7.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(company)/work-with-us/page-4514430dc27fe1f0.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/forgot-password/head-13a4e4a2474dabe9.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/forgot-password/page-826218ecff0b4201.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/login/head-bd18fd9cea18f14f.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/login/page-448af9fc6cde2545.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/register/head-31d3541be4874a21.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/register/page-9e6b6728ea1b267f.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/reset-password/head-bb27a4065bbdfb99.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/reset-password/page-e28ea86b9f394a94.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/twitter-callback/head-c0bd1fda3919a076.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/twitter-callback/page-db65a7cdb1292626.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(user)/profile/error-7463862279e964db.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(user)/profile/head-914a5bbe01b8c981.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(user)/profile/layout-7aa4f704c4251cfc.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(user)/profile/page-5c5fa7d40534b923.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(user)/profile/settings/head-5c16698148b91102.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/(user)/profile/settings/page-c167b9dbf1445ab6.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/admin/add-candidate/head-2c42c1aab613fe57.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/admin/add-candidate/page-4cc433e95e186719.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/admin/candidates/head-1e31e181e0004140.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/admin/candidates/page-256177d9a6e65be5.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/admin/head-7b596190605aa8d6.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/admin/page-35fb58e5a9fe1d74.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/admin/top-issues/head-410578f290d9bcf7.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/admin/top-issues/page-1240ebcf8d633040.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/admin/users/head-c76aae60a9b1cdc2.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/admin/users/page-97985e5ccd0b092e.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/blog/article/%5Bslug%5D/head-b7298f5f5358fe26.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/blog/article/%5Bslug%5D/page-0034b501cafe4733.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/blog/head-25423579eecba5d1.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/blog/page-811f609609b3b252.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/blog/section/%5Bslug%5D/head-e7a627d6c63e9d23.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/blog/section/%5Bslug%5D/page-17a16a1f5b7705f6.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/candidate/%5B...oldSlug%5D/page-867236ddad25613d.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/candidate/%5Bslug%5D/head-2faf5a583c172d12.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/candidate/%5Bslug%5D/page-2c0dbe8a5205c840.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/candidates/%5B%5B...filters%5D%5D/head-cd26313a9a151a52.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/candidates/%5B%5B...filters%5D%5D/page-d4aef3b4ac0eb927.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/faqs/%5B...titleId%5D/head-53ba881db2368b32.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/faqs/%5B...titleId%5D/page-f7590668046d5ce0.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/faqs/head-2971738f366cc455.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/faqs/page-23f934cf2dbccfc2.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/head-59543b4bb1c91df9.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/layout-b3d7188b85cd8b18.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/page-fc8c4a66b0726080.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/political-terms/%5Bslug%5D/head-331f0e341e72f3cc.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/political-terms/%5Bslug%5D/page-72928e336a840c1b.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/political-terms/head-9610798dd97e7e80.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/app/political-terms/page-2d915f56fac9edf5.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/b98bc7c3-6845e68a01b8fc83.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/d64684d8-39ce0715f2ab046f.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/f70991a6-8d09a24effa6a57e.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/main-app-938d202940bc9fa0.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/main-f4ed33d749f814b4.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/pages/_app-cbe2c9d1e8e75269.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/pages/_error-7eb2326bfea6ee40.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js',
          revision: '837c0df77fd5009c9e46d446188ecfd0',
        },
        {
          url: '/_next/static/chunks/webpack-0b9ae046bef9cd10.js',
          revision: 'btcgkER7XmI-awjSP88o0',
        },
        {
          url: '/_next/static/css/0066814787c03d95.css',
          revision: '0066814787c03d95',
        },
        {
          url: '/_next/static/css/07713be254babdf9.css',
          revision: '07713be254babdf9',
        },
        {
          url: '/_next/static/css/08f3171ea9aca7c4.css',
          revision: '08f3171ea9aca7c4',
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
          url: '/_next/static/css/3b062c2d58e4ff3e.css',
          revision: '3b062c2d58e4ff3e',
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
          url: '/_next/static/css/6216a67d9f6f0f20.css',
          revision: '6216a67d9f6f0f20',
        },
        {
          url: '/_next/static/css/6490b1291f7822d7.css',
          revision: '6490b1291f7822d7',
        },
        {
          url: '/_next/static/css/8b672b3b151ae027.css',
          revision: '8b672b3b151ae027',
        },
        {
          url: '/_next/static/css/922b1c29480d07f6.css',
          revision: '922b1c29480d07f6',
        },
        {
          url: '/_next/static/css/9b90fe812ff8f9b7.css',
          revision: '9b90fe812ff8f9b7',
        },
        {
          url: '/_next/static/css/a94fd9998fdf5df2.css',
          revision: 'a94fd9998fdf5df2',
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
          url: '/_next/static/css/dfca8f5a54d8cbb8.css',
          revision: 'dfca8f5a54d8cbb8',
        },
        {
          url: '/_next/static/css/eecd59313114b646.css',
          revision: 'eecd59313114b646',
        },
        {
          url: '/_next/static/css/fe50755fdf2c6a15.css',
          revision: 'fe50755fdf2c6a15',
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
          url: '/_next/static/media/dd7e11d97e6f9605.woff2',
          revision: '09032bab78b9b7fca9b00427ae4083f0',
        },
        { url: '/_next/static/media/slick.25572f22.eot', revision: '25572f22' },
        {
          url: '/_next/static/media/slick.653a4cbb.woff',
          revision: '653a4cbb',
        },
        { url: '/_next/static/media/slick.6aa1ee46.ttf', revision: '6aa1ee46' },
        { url: '/_next/static/media/slick.f895cfdf.svg', revision: 'f895cfdf' },
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
              response: a,
              event: s,
              state: c,
            }) =>
              a && 'opaqueredirect' === a.type
                ? new Response(a.body, {
                    status: 200,
                    statusText: 'OK',
                    headers: a.headers,
                  })
                : a,
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
        const a = e.pathname;
        return !a.startsWith('/api/auth/') && !!a.startsWith('/api/');
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
