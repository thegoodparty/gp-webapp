if (!self.define) {
  let s,
    e = {};
  const a = (a, n) => (
    (a = new URL(a + '.js', n).href),
    e[a] ||
      new Promise((e) => {
        if ('document' in self) {
          const s = document.createElement('script');
          (s.src = a), (s.onload = e), document.head.appendChild(s);
        } else (s = a), importScripts(a), e();
      }).then(() => {
        let s = e[a];
        if (!s) throw new Error(`Module ${a} didn’t register its module`);
        return s;
      })
  );
  self.define = (n, i) => {
    const c =
      s ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href;
    if (e[c]) return;
    let f = {};
    const t = (s) => a(s, c),
      d = { module: { uri: c }, exports: f, require: t };
    e[c] = Promise.all(n.map((s) => d[s] || t(s))).then((s) => (i(...s), f));
  };
}
define(['./workbox-588899ac'], function (s) {
  'use strict';
  importScripts(),
    self.skipWaiting(),
    s.clientsClaim(),
    s.precacheAndRoute(
      [
        {
          url: '/_next/app-build-manifest.json',
          revision: '87484984074e5d1b07fa4a62500d1b02',
        },
        {
          url: '/_next/static/afZIVdf5zEsMBfX-En0w8/_buildManifest.js',
          revision: '17d1d7ca1f6df4adf765db934d98a3b5',
        },
        {
          url: '/_next/static/afZIVdf5zEsMBfX-En0w8/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        {
          url: '/_next/static/chunks/0c428ae2-8081985660b712ef.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/1021-3519d1272d2d6a31.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/1148-56eb3e86dbf383a4.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/1243-7424e65f6a5d1faa.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/1290.6413295863f929fb.js',
          revision: '6413295863f929fb',
        },
        {
          url: '/_next/static/chunks/140.35dd0fbefe316f06.js',
          revision: '35dd0fbefe316f06',
        },
        {
          url: '/_next/static/chunks/1405-801d71d22741255d.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/1543-cc206abd3eb9679a.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/1568-9396e40dfcefcf41.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/17-a299a3852abd7565.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/1bfc9850-51db0d7bbfe4ec02.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/2086-4006b39e56d41cc8.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/2148-43b29f38ac8c8e12.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/2370-67a400fda27bcd93.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/2951-92510902b97e80a4.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/30-8eedddd7a670c8ae.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/31664189-d10e5b4e6e1a354d.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/3535-4d12cc35e909c1c0.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/3622.65b50d6834286905.js',
          revision: '65b50d6834286905',
        },
        {
          url: '/_next/static/chunks/3998-f83878ad3b0b428c.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/4029.adfd6634ac8e2cce.js',
          revision: 'adfd6634ac8e2cce',
        },
        {
          url: '/_next/static/chunks/4090-99757cde3ed80f86.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/4546-6ece06aac921c762.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/4741-1d1c1870592f34de.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/4808.3049c307d9f7d056.js',
          revision: '3049c307d9f7d056',
        },
        {
          url: '/_next/static/chunks/4861-fe9788851e7a3d7a.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/5172-4e7fa61a5e09588b.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/5501.db9fa7913385a231.js',
          revision: 'db9fa7913385a231',
        },
        {
          url: '/_next/static/chunks/5537-9e309aa8b533b090.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
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
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/6653-a70958cfe8d5a3e0.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/672-5c909b1306aff73c.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/6875.0d9823a354483a91.js',
          revision: '0d9823a354483a91',
        },
        {
          url: '/_next/static/chunks/7169-6c7d5a2b6bd3d93a.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/717-b2ff6e6fbf8dbf62.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/7373-2b1bb4904b0fd108.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/7461.18c902a269b0d598.js',
          revision: '18c902a269b0d598',
        },
        {
          url: '/_next/static/chunks/7829-042e1247ad0e696b.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/78e521c3-4fe6e9901568cce7.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/8402-ea50d23fb0b03290.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/8605-a1331084686dff6d.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/866.1467c5bfd32aca55.js',
          revision: '1467c5bfd32aca55',
        },
        {
          url: '/_next/static/chunks/8734-1b0a12487e9107e7.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/9258-c26f8bdefce08399.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/9375-0fb548300bf20e44.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/9411-7c5718346d5f61dd.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/95b64a6e-6b36af4fa5d4aaa5.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
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
          url: '/_next/static/chunks/9828-13169d86eb159a47.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/9885-9b4dcac39aa9aed0.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/9900-9ca519d7b156a9b4.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/admin/head-110afac711797a77.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/admin/page-a178620cc0649c38.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/edit-campaign/head-76748b2348a5fc1f.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/edit-campaign/page-f0afbc4df7ab5803.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/endorsements/head-ebf3bd57269f9e53.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/endorsements/page-5351a9ea87867501.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/head-e3d3bf02210d274c.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/page-17f4aac7d959d3fe.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/top-issues/head-29e2752619ff5837.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/top-issues/page-272cbfb4ebc0990c.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(company)/about/error-956b45007414be8d.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(company)/about/head-8d4d89d74a029db9.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(company)/about/page-c8e11f6ddfb0c087.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(company)/contact/head-f7355eecfb3e53e0.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(company)/contact/page-a4a670c46d657389.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(company)/manifesto/head-25926dfa313d192e.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(company)/manifesto/page-8c3c32ce0509b812.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(company)/pricing/head-1619f8ababfc50bf.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(company)/pricing/page-b73438dd45cd1098.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(company)/privacy/head-d9d2bdee232fabe1.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(company)/privacy/page-430d4bf89c19a0bf.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(company)/run/head-ffd86efb8a073734.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(company)/run/page-9501d84e6006a2da.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(company)/team/error-54f96da6092731af.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(company)/team/head-cca73ca80f5d3e63.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(company)/team/page-4c8088c4845b3e81.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(company)/work-with-us/head-f8ca5a30635795b1.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(company)/work-with-us/page-d29c852e3f8b51c0.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/forgot-password/head-fa45e94e4fb30372.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/forgot-password/page-f6354b730f7b9be3.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/login/head-ced4dafff5fb7ada.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/login/page-f93fdd5e0b625b8c.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/register/head-2740e59240d9eae9.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/register/page-5ccd419e167b6860.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/reset-password/head-c84954da23308d60.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/reset-password/page-fcff051b884ee9f3.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/twitter-callback/head-be1c2b7ee63937ba.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/twitter-callback/page-101f6d2fb1df3df7.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(user)/profile/error-7463862279e964db.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(user)/profile/head-90c9e7c5fbf66300.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(user)/profile/layout-384585a312a8db9c.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(user)/profile/page-2f73dd1db2f0f4cb.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(user)/profile/settings/head-6fed0018a314e06b.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/(user)/profile/settings/page-bc9088584be04203.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/admin/add-candidate/head-79ccf522281f3d53.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/admin/add-candidate/page-b77fb0ab2c54967d.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/admin/candidates/head-9e191b454cf408f0.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/admin/candidates/page-eaf239ead84b543b.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/admin/head-974a34618454efcc.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/admin/page-3bbc8bbcef865e1f.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/admin/top-issues/head-752ccba490dd4703.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/admin/top-issues/page-bbeb5ba3a306425e.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/admin/users/head-b0795035d5b37a74.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/admin/users/page-aadf335d54a6864f.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/blog/article/%5Bslug%5D/head-04057c96f693d4c9.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/blog/article/%5Bslug%5D/page-840e13ddc942d676.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/blog/head-f7da82d86155fe44.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/blog/page-f26407f8a27c6c98.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/blog/section/%5Bslug%5D/head-5ff18a371712610e.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/blog/section/%5Bslug%5D/page-8a3e6b7f97557dc9.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/candidate/%5B...nameId%5D/head-314d196e6d74493b.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/candidate/%5B...nameId%5D/page-9430071657a4c499.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/candidates/%5B%5B...filters%5D%5D/head-c5f9c38a6720979e.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/candidates/%5B%5B...filters%5D%5D/page-ac3f35f6c2457646.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/faqs/%5B...titleId%5D/head-74c56d374e3cd00a.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/faqs/%5B...titleId%5D/page-1f2a2465462c8682.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/faqs/head-24263a75f4b80485.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/faqs/page-3a6e34b986e5172d.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/head-8ca220a1baa2d68e.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/layout-ac84786ef8951ac0.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/page-3723bce54c59d8d8.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/political-terms/%5Bslug%5D/head-b2b0cf49431bd0d5.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/political-terms/%5Bslug%5D/page-b49bfe1a6bc50fc1.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/political-terms/head-a154c05b48fd4f2b.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/app/political-terms/page-b5a717352528663b.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/b98bc7c3-6845e68a01b8fc83.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/d64684d8-39ce0715f2ab046f.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/f70991a6-8d09a24effa6a57e.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/main-2c9494a408d01b0d.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/main-app-f13f21a96de09ecb.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/pages/_app-cbe2c9d1e8e75269.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/pages/_error-7eb2326bfea6ee40.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js',
          revision: '837c0df77fd5009c9e46d446188ecfd0',
        },
        {
          url: '/_next/static/chunks/webpack-005780c078f7bee3.js',
          revision: 'afZIVdf5zEsMBfX-En0w8',
        },
        {
          url: '/_next/static/css/0066814787c03d95.css',
          revision: '0066814787c03d95',
        },
        {
          url: '/_next/static/css/00b796305abbd0af.css',
          revision: '00b796305abbd0af',
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
          url: '/_next/static/css/1815c20a37e59b58.css',
          revision: '1815c20a37e59b58',
        },
        {
          url: '/_next/static/css/1ff80f8f155af240.css',
          revision: '1ff80f8f155af240',
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
          url: '/_next/static/css/5a7d59368d77e84b.css',
          revision: '5a7d59368d77e84b',
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
          url: '/_next/static/css/6d33c8d315a041ec.css',
          revision: '6d33c8d315a041ec',
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
          url: '/_next/static/css/9defd4d426eb1649.css',
          revision: '9defd4d426eb1649',
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
          url: '/_next/static/css/b8b778eb506357e3.css',
          revision: 'b8b778eb506357e3',
        },
        {
          url: '/_next/static/css/c9538334b4637d87.css',
          revision: 'c9538334b4637d87',
        },
        {
          url: '/_next/static/css/cbc4686497573fea.css',
          revision: 'cbc4686497573fea',
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
        { url: '/manifest.json', revision: '82835d3211b2cd209c04c2fbb2e56fe6' },
        { url: '/robots.txt', revision: 'b29287e8c2c16d344e8abcc37592bd65' },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    s.cleanupOutdatedCaches(),
    s.registerRoute(
      '/',
      new s.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({
              request: s,
              response: e,
              event: a,
              state: n,
            }) =>
              e && 'opaqueredirect' === e.type
                ? new Response(e.body, {
                    status: 200,
                    statusText: 'OK',
                    headers: e.headers,
                  })
                : e,
          },
        ],
      }),
      'GET',
    ),
    s.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new s.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
          new s.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      'GET',
    ),
    s.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new s.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [
          new s.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET',
    ),
    s.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new s.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [
          new s.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET',
    ),
    s.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new s.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [
          new s.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    s.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new s.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [
          new s.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    s.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new s.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new s.RangeRequestsPlugin(),
          new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    s.registerRoute(
      /\.(?:mp4)$/i,
      new s.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new s.RangeRequestsPlugin(),
          new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    s.registerRoute(
      /\.(?:js)$/i,
      new s.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [
          new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    s.registerRoute(
      /\.(?:css|less)$/i,
      new s.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [
          new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    s.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new s.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [
          new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    s.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new s.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [
          new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    s.registerRoute(
      ({ url: s }) => {
        if (!(self.origin === s.origin)) return !1;
        const e = s.pathname;
        return !e.startsWith('/api/auth/') && !!e.startsWith('/api/');
      },
      new s.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [
          new s.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    s.registerRoute(
      ({ url: s }) => {
        if (!(self.origin === s.origin)) return !1;
        return !s.pathname.startsWith('/api/');
      },
      new s.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [
          new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    s.registerRoute(
      ({ url: s }) => !(self.origin === s.origin),
      new s.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [
          new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      'GET',
    );
});
