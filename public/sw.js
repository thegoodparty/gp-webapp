if (!self.define) {
  let e,
    a = {};
  const i = (i, s) => (
    (i = new URL(i + '.js', s).href),
    a[i] ||
      new Promise((a) => {
        if ('document' in self) {
          const e = document.createElement('script');
          (e.src = i), (e.onload = a), document.head.appendChild(e);
        } else (e = i), importScripts(i), a();
      }).then(() => {
        let e = a[i];
        if (!e) throw new Error(`Module ${i} didn’t register its module`);
        return e;
      })
  );
  self.define = (s, n) => {
    const c =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href;
    if (a[c]) return;
    let r = {};
    const d = (e) => i(e, c),
      t = { module: { uri: c }, exports: r, require: d };
    a[c] = Promise.all(s.map((e) => t[e] || d(e))).then((e) => (n(...e), r));
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
          revision: '2a8b0615c88f4496cd412079249ad403',
        },
        {
          url: '/_next/static/X_gAQ5HndUNh5YB0cxLD_/_buildManifest.js',
          revision: '170c66d702bd53d2994893493ff4667b',
        },
        {
          url: '/_next/static/X_gAQ5HndUNh5YB0cxLD_/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        {
          url: '/_next/static/chunks/081ca426-3e989002fc9cecae.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/0e762574-da4a6d227749c660.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/1051-636f5cbfd526e4e8.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/1055-b185e57876df4f57.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/1193-e9f60c50f6b945f3.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/1337-c20eae7f10d4dd5a.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/1530-f1cf60878763caf8.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/154.19d1130ee0a1a0ea.js',
          revision: '19d1130ee0a1a0ea',
        },
        {
          url: '/_next/static/chunks/1573-2e8b60a87c13f3d3.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/1639-75f3d451c7c4100d.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/164-d2983fdd4137b254.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/1646-b422c34251ae7f5a.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/1655-29fbf5a651c7f538.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/1755-597bc1d271dbfd6f.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/1893-0c6feac8179c3aa9.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/196-6773381a2157220c.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/2012-53c3ae4a18376c7c.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/2152-706d6f60c156f07c.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/223-2a9dc3db0d5de1f2.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/2231-977965603dfae7f8.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/231-3effe782ff1fee8f.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/2485-782f68bed5ba19ee.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/2517-073022e17fa7b936.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/2843-a40ad64a51c75d97.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/30a37ab2-d09eea7849379cdd.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/3180-8ffec01056707e01.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/362-3d8efc4b0e21c1be.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/370b0802-e121533dc50a12c1.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/385cb88d-c2411423e6ec4dbc.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/3876-19f5af3d599eebe9.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/3916-a04fd90b3fb6f921.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/3983-8c6e593d6998a2b7.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/3985-d47b241e1d8ea1aa.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/4082-24046a781a43c3d4.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/4086-3de75ae5777d910c.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/4116-ced6121a308376da.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/4156-350f9995d9ef4ae9.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/4223.4b049fbb49c31ede.js',
          revision: '4b049fbb49c31ede',
        },
        {
          url: '/_next/static/chunks/4239-f36f8eaf6b791bdf.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/4299-f998afea5b703a77.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/4357-9f9d75eecb5120ca.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/4386-b2acb2a78b21db44.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/4569-fb8dbbfc2f824007.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/4720-35e41811a7dc9b0e.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/479ba886-8f79c5830c1b13c0.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/4870-87c6e195c0325ef6.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/4892-a40c8d71f7eec9c1.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/4e6af11a-799906a114008325.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/5151-aeb20bcbf55eb9f6.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/5157-c4f77e2aada933dc.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/5223-604d0d3913e12f42.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/53c13509-7bb5f8f9cae2d4a7.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/5506-97fd2883587fa93b.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/5791.922127b8d879e3e5.js',
          revision: '922127b8d879e3e5',
        },
        {
          url: '/_next/static/chunks/59650de3-9e9e9d82dc4e2501.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/5967-3a2be1fad15980c7.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/5e22fd23-85462b5a6909a34c.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/6020-bf5ced6273f527b5.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/6113-88cf960b2f724622.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/6183-f7dc9650064c94ee.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/619edb50-b18fecd106305b83.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/639-6b82cdd73444dab2.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/6483-f1c4fac645895236.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/6635-704953193cf02c27.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/6639-a24d2f04a4d1c7c9.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/66ec4792-344f5506d9e8d0d1.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/6726-4ec79c278beee5e7.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/7023-9f97efaaec59792d.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/7048-f275e507cab13f01.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/7049-83c527fffcac3e27.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/7221-ecfbba11eff87a0a.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/7298.b6202b139fff7e57.js',
          revision: 'b6202b139fff7e57',
        },
        {
          url: '/_next/static/chunks/7356-6062ebdef8f27fbd.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/7379-ab94dc98d5acaf38.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/7550-7f6668b4a503b39e.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/7821-1ca44267f948c445.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/7878.47a59706411b1359.js',
          revision: '47a59706411b1359',
        },
        {
          url: '/_next/static/chunks/7927-c90d1e775130bd57.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/795d4814-b4a2548a50ba356f.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/8012d7e2-a85481f051808436.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/8144-5aac60b5eb6c87a3.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/8173-eb39a64f294d49e7.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/8176-492270e22e701290.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/819-8daa742ebf2fc076.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/8255.f080018aa93ce5e7.js',
          revision: 'f080018aa93ce5e7',
        },
        {
          url: '/_next/static/chunks/8387-b66aaef3dc5563da.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/8401-3b0b73213eb4a266.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/8649-b461c5bb4e4f97f3.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/8706.4ce0443106d45f43.js',
          revision: '4ce0443106d45f43',
        },
        {
          url: '/_next/static/chunks/8865-292805cb9afc1d3b.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/8893-e6026923b41c4bb1.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/8990-035f14d58bc8fe67.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/8e1d74a4-2c638d115c44bd5e.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/9022-05aba8f18d1da10e.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/9238-254902320ef16398.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/9297-0c69cc2241f62510.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/94730671-577b7f12fff1d2d7.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/9485-6989eab149af24ce.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/9499-f5b7ed8c1da2a78e.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/9565-74ceac96eb3f5a5d.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/9897-16a86137befaa16f.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/9c4e2130-9266bdb0a889a5d4.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/dashboard/content/%5Bslug%5D/page-9bc6dcc614c12288.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/dashboard/content/page-ea0f7439a2bf24ec.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/dashboard/details/page-35cb5a30e8d25501.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/dashboard/door-knocking/campaign/%5Bslug%5D/page-6557943f16509ae3.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/dashboard/door-knocking/campaign/%5Bslug%5D/route/%5Bid%5D/page-e8ca536d663614f2.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/dashboard/door-knocking/main/page-bc7185599c05ced8.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/dashboard/funding/page-1c53f7c49a80f73c.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/dashboard/page-cfffa0619b9447a1.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/dashboard/plan/page-7ead2256cee5b7b3.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/dashboard/questions/page-e9c7888c33b51672.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/dashboard/resources/page-bc5a717c88128088.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/dashboard/team/page-63d149edb9ed79d6.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/dashboard/voter-records/page-a0c94ca9ae00ca54.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/%5Bstep%5D/page-41ae0463ec5132ce.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(company)/about/page-fbffa50e794a37b5.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(company)/contact/page-7fdf8ee8a0fa5bc1.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(company)/declare/page-1d2a32e078e76284.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(company)/privacy/page-267afaa2f2f55351.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(company)/product-tour/page-dbe4358cb8b1f9b0.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(company)/team/page-2b6c86a7da3535e4.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(company)/volunteer/page-87112c272278df12.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(company)/work-with-us/%5Bslug%5D/page-e7dea25655b84ab7.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(company)/work-with-us/page-2ce1a4ce4cf9a7b9.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/forgot-password/page-44f292cb4af241b9.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/login/page-9f1170e86dedd82b.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/reset-password/page-a87b7cf82e88c069.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(entrance)/set-name/page-fb6e0cf9cd13b32f.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(landing)/academy-intro/page-f0a7e6d23933e5dc.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(landing)/academy-webinar/page-7b6505e5399de871.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(landing)/academy/page-aa57e09ecd663265.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(landing)/ads2023/page-8a9a4e6240815d2e.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(landing)/election-results/%5B...params%5D/page-3883433e44ea3154.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(landing)/elections/%5Bstate%5D/%5Bcounty%5D/%5Bcity%5D/page-4530494b146b59e7.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(landing)/elections/%5Bstate%5D/%5Bcounty%5D/page-f8ad4be89921aca1.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(landing)/elections/%5Bstate%5D/page-610071b345264c02.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(landing)/elections/page-f3ad3e38e66e6f4b.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(landing)/elections/position/%5B...loc%5D/page-336dee510fa366ec.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(landing)/get-a-demo/page-1f8c7062a8a874cf.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(landing)/info-session/page-268367197cf19999.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(landing)/local-elections-webinar/page-ae8f4ec5f71a0a38.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(landing)/pro-consultation/page-5623c184d8452be1.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(landing)/run-for-office/page-025d8547e9e24c63.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(landing)/upgrade-to-pro/page-88188079a5e3d953.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(user)/profile/page-da83447cd536f39c.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(volunteer)/volunteer-dashboard/door-knocking/%5Bdkslug%5D/route/%5Bid%5D/address/%5Bvoterid%5D/page-455be97c9da61911.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(volunteer)/volunteer-dashboard/door-knocking/%5Bdkslug%5D/route/%5Bid%5D/page-f7128a9a731fccb8.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(volunteer)/volunteer-dashboard/door-knocking/page-17615b707896ee58.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/(volunteer)/volunteer-dashboard/page-1b7c4305e5925dae.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-7829e21dbddf5607.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/admin/add-candidate/page-305605a564e7c4b1.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/admin/ai-content/page-aae9bc963d19fae0.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/admin/all-candidates/page-1546a7af735ebe93.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/admin/caches/page-0ff79f0c2adfdde2.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/admin/campaign-statistics/page-54c06dcf9d03db98.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/admin/candidate-metrics/%5Bslug%5D/page-3bc165608405cdf1.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/admin/candidates/page-725114286e7b625f.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/admin/misc-actions/page-65a72a38f434e385.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/admin/p2v-stats/page-a3b68a888ad3167c.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/admin/page-af3f27dfc37d1ab2.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/admin/top-issues/page-f7fc6e05b4ee6397.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/admin/users/page-054c971bef6bf673.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/admin/victory-path/%5Bslug%5D/page-81ad6702db469e8a.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/blog/article/%5Bslug%5D/page-e3c20f55fe8dea7e.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/blog/page-ce91e7e83f377692.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/blog/section/%5Bslug%5D/page-1cdebbc15b293254.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/blog/tag/%5Btag%5D/page-19a0e6826d09ddd5.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/candidate/%5Bname%5D/%5Boffice%5D/page-aca2daf372486348.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/error-d05307b3b9372569.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/faqs/%5B...titleId%5D/page-607b502e7ffdc11f.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/faqs/page-fb596084e7773b32.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/layout-842d90608d3c1c7c.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/not-found-2edb945fc1b7e482.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/page-a9617bdd69a7cdb4.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/political-terms/%5Bslug%5D/page-9deb0a37635889da.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/app/political-terms/page-4e8ca9b2894d5c20.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/b563f954-abf62daefba30062.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/dc112a36-dd72e56818520f67.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/ee560e2c-43c3cefc382aa37d.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/eec3d76d-bdcbbb187c6ba4d8.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/f8025e75-cf715507d41886b9.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/f97e080b-41a1e168d239959b.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/fc2f6fa8-37dd54aa83623506.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/fca4dd8b-92a22728fbade344.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/fd9d1056-6427cdad3be44808.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/framework-08aa667e5202eed8.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/main-9bd82f70265dc815.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/main-app-f41ad75389e7ec46.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/pages/_app-f870474a17b7f2fd.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/pages/_error-c66a4e8afc46f17b.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js',
          revision: '79330112775102f91e1010318bae2bd3',
        },
        {
          url: '/_next/static/chunks/webpack-80f9811cba26037c.js',
          revision: 'X_gAQ5HndUNh5YB0cxLD_',
        },
        {
          url: '/_next/static/css/1508db9dd9e94f19.css',
          revision: '1508db9dd9e94f19',
        },
        {
          url: '/_next/static/css/356c6f61aa469916.css',
          revision: '356c6f61aa469916',
        },
        {
          url: '/_next/static/css/35c9a1919177082c.css',
          revision: '35c9a1919177082c',
        },
        {
          url: '/_next/static/css/366cec909544a782.css',
          revision: '366cec909544a782',
        },
        {
          url: '/_next/static/css/78d96c595884f8d9.css',
          revision: '78d96c595884f8d9',
        },
        {
          url: '/_next/static/css/947cf4fe0dad8814.css',
          revision: '947cf4fe0dad8814',
        },
        {
          url: '/_next/static/css/96a93caf95fe3a27.css',
          revision: '96a93caf95fe3a27',
        },
        {
          url: '/_next/static/css/9c78b349c4aa9f26.css',
          revision: '9c78b349c4aa9f26',
        },
        {
          url: '/_next/static/css/9d7d90af6da2af8e.css',
          revision: '9d7d90af6da2af8e',
        },
        {
          url: '/_next/static/css/e548ae71644cb2df.css',
          revision: 'e548ae71644cb2df',
        },
        {
          url: '/_next/static/css/ee44173d4b5b081a.css',
          revision: 'ee44173d4b5b081a',
        },
        {
          url: '/_next/static/media/07a54048a9278940-s.p.woff2',
          revision: '5e6c7802c5c4cc0423f86c3aad29f60a',
        },
        {
          url: '/_next/static/media/0fe7ec85885462b1-s.p.woff2',
          revision: 'abe60269bd99b7f36cd026bd02af92a6',
        },
        {
          url: '/_next/static/media/314c557e4b656089-s.p.woff2',
          revision: 'a2da0f752e3e033ae9b09b495522b9e8',
        },
        {
          url: '/_next/static/media/3e0204632fc66b80-s.woff2',
          revision: 'fb246d96edd5fd01c759dc65c5c2594b',
        },
        {
          url: '/_next/static/media/4f2204fa15b9b11a-s.woff2',
          revision: '6f4cf2d9f078b52024414970b7b7f704',
        },
        {
          url: '/_next/static/media/640ece80909a508b-s.p.woff2',
          revision: 'c454edfb6f6f51bb1c65d35b0df779c4',
        },
        {
          url: '/_next/static/media/6ca83f1508666046-s.p.woff2',
          revision: '52ea0d7008516c101595f81d37225889',
        },
        {
          url: '/_next/static/media/6ed04a86ee0f9353-s.woff2',
          revision: '0f441f4e176611d215dd821a24c2ed36',
        },
        {
          url: '/_next/static/media/7b6fea621790da4d-s.p.woff2',
          revision: '0229ea633558c4c9c1fbc1c92e5a0de3',
        },
        {
          url: '/_next/static/media/ads-hero.38b0395b.jpg',
          revision: 'c3be37fb7a66e0b63e3e0632c7617815',
        },
        {
          url: '/_next/static/media/ajax-loader.0b80f665.gif',
          revision: '0b80f665',
        },
        {
          url: '/_next/static/media/art.9677d24a.png',
          revision: '7019997973d5c29460f1eee7ce6478bc',
        },
        {
          url: '/_next/static/media/ballot-box.870ae98b.png',
          revision: '97bbc1fd34deb5f8869f770bb0431937',
        },
        {
          url: '/_next/static/media/breanna.5a30ebbd.png',
          revision: '4b97964feb0506e881148232550130e8',
        },
        {
          url: '/_next/static/media/breanna2.3f678d8a.png',
          revision: 'cb48e15d811007be5cd9307ad27ccb7a',
        },
        {
          url: '/_next/static/media/c08f427a5265f6e0-s.p.woff2',
          revision: '5ce1154f5b40c7bc53da70d852b3ea3e',
        },
        {
          url: '/_next/static/media/campaign-tracker.ffd64340.png',
          revision: '89c9021036d24e225783f9828918c918',
        },
        {
          url: '/_next/static/media/candidate-hero-color.e8df0e1d.jpg',
          revision: 'afa5db6b7434bcd85dab40a7e4204c69',
        },
        {
          url: '/_next/static/media/carlos.7d0b9051.png',
          revision: '5b7a6cd4b383b6abada7f7fa2938f25b',
        },
        {
          url: '/_next/static/media/certified.4bfd6e73.png',
          revision: 'dfdccd42955171e4cac9e72b37d10bd1',
        },
        {
          url: '/_next/static/media/change.71ceb952.png',
          revision: '886fcf3712cfbfa155d46160b833ad55',
        },
        {
          url: '/_next/static/media/community.e13a118d.png',
          revision: '3b9139b245a0cbed6cc8cdd65db805d7',
        },
        {
          url: '/_next/static/media/creativity.30c75ef6.png',
          revision: 'c309e055a5de7cb6698573a7545cba76',
        },
        {
          url: '/_next/static/media/d444cb7ee49237c9-s.p.woff2',
          revision: 'af64ab08547cc18daa32439d1f6c9c05',
        },
        {
          url: '/_next/static/media/d5fafdc7bbd3315c-s.p.woff2',
          revision: 'b105cf87bfe3a58447db822e7fdb0875',
        },
        {
          url: '/_next/static/media/dashboard.5bb3f431.png',
          revision: 'd494d26834e15ee01e8928376697ad7c',
        },
        {
          url: '/_next/static/media/democratic-logo.843edb36.png',
          revision: '9998894210a69c8226c64aba8fac4e72',
        },
        {
          url: '/_next/static/media/desyiah.28f092a8.png',
          revision: '4b06fbdc3d32658db1d792489b6d7f01',
        },
        {
          url: '/_next/static/media/discord-people.069e024c.png',
          revision: 'be80d33b4ecd7429d7fe547289ee31f8',
        },
        {
          url: '/_next/static/media/discord-user1.0b82cae3.png',
          revision: 'c322dfe8bde09d94c7c4463104670bb9',
        },
        {
          url: '/_next/static/media/discord-user2.7be4d0c1.png',
          revision: 'a226528d34bc3811262273a050073c8c',
        },
        {
          url: '/_next/static/media/discord-user3.0b646b9c.png',
          revision: '0075dd02d6d26a4230172996428f4b51',
        },
        {
          url: '/_next/static/media/discord-user4.30de1f15.png',
          revision: '88722a9255649cda161d7e5406138da1',
        },
        {
          url: '/_next/static/media/discord-user5.85cc2add.png',
          revision: 'dbfe7c40f663f114ab891013bed51b23',
        },
        {
          url: '/_next/static/media/discord.44bb92aa.png',
          revision: '0c75469d601ff254e6021234782f0ad3',
        },
        {
          url: '/_next/static/media/door-knocking.27c04423.png',
          revision: 'ea8ebcc09a515bb9c29874f987bbbc21',
        },
        {
          url: '/_next/static/media/elected-leaders.a85a9f36.png',
          revision: '5b944b8d248a4b039d85b391e0fa6ecf',
        },
        {
          url: '/_next/static/media/electoral.2f7139be.png',
          revision: '8486f6fbe0bfbddeb12d168785e424bd',
        },
        {
          url: '/_next/static/media/empty-dashboard.1f8fbbc3.jpg',
          revision: '08b7bbfd7031a6b7f0b32db656249292',
        },
        {
          url: '/_next/static/media/expert-jared.512230b7.png',
          revision: '3b8d6353c00f4a5a147895f6e8188a3b',
        },
        {
          url: '/_next/static/media/expert-rob.bc6be2d8.png',
          revision: '65b0afd91eb412c52e3e29a66440fb48',
        },
        {
          url: '/_next/static/media/experts.046e93c3.png',
          revision: '5f80f88563d55c3f32fc920bdc7064af',
        },
        {
          url: '/_next/static/media/friends.b9ef18a5.png',
          revision: '482d852eb8a1f4e076421d27ec28f311',
        },
        {
          url: '/_next/static/media/fwd-logo.03c459a9.png',
          revision: '10f85ad4b9572a1af3d48022e7fe4ed4',
        },
        {
          url: '/_next/static/media/genz.aee68ec3.png',
          revision: '4dfb8ea4de015abddc9fa04f01bdd477',
        },
        {
          url: '/_next/static/media/green-logo.78b62f56.png',
          revision: 'e9e8a30f2f0a4decbeeac60705ff2d10',
        },
        {
          url: '/_next/static/media/help.30bf4d8f.png',
          revision: '074e44507af0b567e37fb494a405d182',
        },
        {
          url: '/_next/static/media/hourglass.96f8d29e.png',
          revision: '4395228031df044f52b2b18076759e34',
        },
        {
          url: '/_next/static/media/impact.42f9163c.png',
          revision: '0a22f2e09556793b800259eae7b9c84a',
        },
        {
          url: '/_next/static/media/independent.c600fb7d.png',
          revision: '307bbad4a3d8b43faf15439f994214e0',
        },
        {
          url: '/_next/static/media/info-people.72477990.png',
          revision: '3805a3b288ae3f2e2e93e92e71969781',
        },
        {
          url: '/_next/static/media/jarob.9ef7f22a.png',
          revision: '087b777ab7c21dab9015c139757e0600',
        },
        {
          url: '/_next/static/media/kieryn-small.5de8bcab.png',
          revision: '8c78f88a0fb9546cf9b332b008237a56',
        },
        {
          url: '/_next/static/media/kieryn.8f5e45b9.png',
          revision: '3d12c29ed559bae3316f4036fddaab35',
        },
        {
          url: '/_next/static/media/levelup.c38162a3.png',
          revision: '6ec1d52f7264c42e3b0a872e07bdcca4',
        },
        {
          url: '/_next/static/media/libertarian-logo.94b7b1d7.png',
          revision: 'a2314553c025f8da37205ad89e85dea2',
        },
        {
          url: '/_next/static/media/lisa.be82e19e.png',
          revision: '8ab27a148416cf5b60767b11ae5d913c',
        },
        {
          url: '/_next/static/media/map.5afe81ea.png',
          revision: '95099d7f19a28e90891d86caa04c0e7d',
        },
        {
          url: '/_next/static/media/map.61f68095.png',
          revision: '82f5035cd9fa4bf548adc301a11dccb1',
        },
        {
          url: '/_next/static/media/map.89b167db.png',
          revision: '50ebc63d19ba15f13c6934d574110b12',
        },
        {
          url: '/_next/static/media/map.f2a6ebe4.png',
          revision: 'df11efaed3c03e523557338ee8002114',
        },
        {
          url: '/_next/static/media/marty.cfa29ee5.png',
          revision: '7dfc9a1e68423f708a212304eca2deb1',
        },
        {
          url: '/_next/static/media/meeting.0bcb5613.jpg',
          revision: '8a8f5689f5a88d574abb431587744467',
        },
        {
          url: '/_next/static/media/megaphone.0e5c6ed5.png',
          revision: '810b33c32d6b452d11b60728c8aea672',
        },
        {
          url: '/_next/static/media/my-content.75651b06.png',
          revision: '24cf476b6224d1f81a3906a01806c18b',
        },
        {
          url: '/_next/static/media/networking.6c28211b.png',
          revision: 'bea857070f38cb6726ea0af8c540b2f4',
        },
        {
          url: '/_next/static/media/perks.4d0c4e8c.png',
          revision: '44f6c180781138a0a8bf298a08b66c7b',
        },
        {
          url: '/_next/static/media/qr-door-knocking.1ca56383.png',
          revision: 'de107c020afb85a8e9a0406e674445f7',
        },
        {
          url: '/_next/static/media/reform-logo.fe9e9ee4.png',
          revision: 'd381ad0d90026f56a23349c1a1d93afa',
        },
        {
          url: '/_next/static/media/republican-logo.643e8a63.png',
          revision: '08a2a467879b3d304c10fe06030122f6',
        },
        {
          url: '/_next/static/media/rob3.86892506.png',
          revision: 'fcee72611461c34e851a438823de1c00',
        },
        {
          url: '/_next/static/media/run-hero.e8e82d81.png',
          revision: '378bb698bb5c7e778b4e46f510061971',
        },
        {
          url: '/_next/static/media/sal-davis.372d6021.png',
          revision: '09c6fc12470a577678a6fb41d5c422de',
        },
        { url: '/_next/static/media/slick.25572f22.eot', revision: '25572f22' },
        {
          url: '/_next/static/media/slick.653a4cbb.woff',
          revision: '653a4cbb',
        },
        { url: '/_next/static/media/slick.6aa1ee46.ttf', revision: '6aa1ee46' },
        { url: '/_next/static/media/slick.f895cfdf.svg', revision: 'f895cfdf' },
        {
          url: '/_next/static/media/software.9aab117c.png',
          revision: '1c21f0da57a52bed49a9828376640366',
        },
        {
          url: '/_next/static/media/star.7e186f92.png',
          revision: '533c9eb9434d305ebefaae536a4fcda7',
        },
        {
          url: '/_next/static/media/terry-c.2743866a.png',
          revision: '89865effe7592f891b861554f332fc53',
        },
        {
          url: '/_next/static/media/terry.463cc61e.png',
          revision: '922609a4b7bb0c2f6c353ebb415b4fb4',
        },
        {
          url: '/_next/static/media/victoria.ac3fa181.png',
          revision: '574f4392d535fcf3a366cc481457f1f1',
        },
        {
          url: '/_next/static/media/victoria2.2f9c3074.png',
          revision: 'c5cf1a645f21419180b7fc6a83db60b0',
        },
        {
          url: '/_next/static/media/volunteer-hero.523fd6fe.png',
          revision: '2bb47a9abc76147dab30b675889c9a94',
        },
        {
          url: '/_next/static/media/volunteer1.a860122a.png',
          revision: 'df93416793370c870a99f1859f6e085b',
        },
        {
          url: '/_next/static/media/volunteer2.4cc98f80.png',
          revision: '7b5c681fe662d93f0ca502079bd0ef3e',
        },
        {
          url: '/_next/static/media/wave.7328f466.png',
          revision: '9c5fbe28d9f6f4c33cc694bf801fa98a',
        },
        {
          url: '/_next/static/media/webinar-hero.5cf57c4e.png',
          revision: 'c87f10a88118f9b9cdd6e0a82407b9d3',
        },
        {
          url: '/_next/static/media/win.560b4b83.png',
          revision: 'bc2b7d21fdc7aaf3a575f89fc69eaef2',
        },
        { url: '/favicon.ico', revision: '802717f7b2a0c5379133a794cded7c8c' },
        {
          url: '/fonts/SFProDisplay-Black.woff2',
          revision: '051e4d91dc88d10f19090107193629b8',
        },
        {
          url: '/fonts/SFProDisplay-Bold.woff2',
          revision: '33802914271ef3d489d31399a5c8c3af',
        },
        {
          url: '/fonts/SFProDisplay-Light.woff2',
          revision: '0229ea633558c4c9c1fbc1c92e5a0de3',
        },
        {
          url: '/fonts/SFProDisplay-Medium.woff2',
          revision: '52ea0d7008516c101595f81d37225889',
        },
        {
          url: '/fonts/SFProDisplay-Regular.woff2',
          revision: 'abe60269bd99b7f36cd026bd02af92a6',
        },
        {
          url: '/fonts/SFProDisplay-Semibold.woff2',
          revision: 'af64ab08547cc18daa32439d1f6c9c05',
        },
        {
          url: '/fonts/SFProDisplay-Thin.woff2',
          revision: '16e844ac92f1030c7acd7e5ede40789c',
        },
        {
          url: '/fonts/SFProDisplay-Ultralight.woff2',
          revision: 'a01866edaa839e84c1253f3b548b2e37',
        },
        {
          url: '/images/black-logo.svg',
          revision: '8b1420010774a47267eb29cced8ed21b',
        },
        {
          url: '/images/campaign/ai-icon.svg',
          revision: '75a621a70c8f04fafefa95759511c7f2',
        },
        {
          url: '/images/campaign/color-wheel.svg',
          revision: '97cffec05ae43d9a94408fc57b65fd73',
        },
        {
          url: '/images/campaign/confetti-icon.png',
          revision: '7d53c0ef88eeddb754dab3ab2b4dba7a',
        },
        {
          url: '/images/campaign/dashboard-bg.svg',
          revision: 'a881776ecc9223774b05ec3fff995083',
        },
        {
          url: '/images/campaign/dashboard-bg2.svg',
          revision: '8cfce07becc249d06a265dc9169a7666',
        },
        {
          url: '/images/campaign/gp-ai.png',
          revision: '28114e98c32004b4c2d891f8abd8cb7a',
        },
        {
          url: '/images/campaign/in-progress.svg',
          revision: '1fc13e0dfecb062239eacf34b9c71b9c',
        },
        {
          url: '/images/campaign/jared.jpg',
          revision: '8b29bc5dd44f98660997b5693fc9e720',
        },
        {
          url: '/images/campaign/jared.png',
          revision: '7d642cca8b0bc1aadba3c72628cb1cf6',
        },
        {
          url: '/images/campaign/manager-bg.png',
          revision: 'b5fbea6d18cf683e9da4d175c12fc5f9',
        },
        {
          url: '/images/campaign/rob1.png',
          revision: '58e5dcf3dd3508382a0fe15008cb1b84',
        },
        {
          url: '/images/campaign/rocket.svg',
          revision: '11ca9512c21be6319ca937c2c209ade2',
        },
        {
          url: '/images/campaign/spinner.gif',
          revision: 'a33844d2290680a4e0c323cec5b37226',
        },
        {
          url: '/images/campaign/team-bg.svg',
          revision: '4cf005fde0bde620b17e25f84070a290',
        },
        {
          url: '/images/candidate/candidate-hero-color.jpg',
          revision: 'afa5db6b7434bcd85dab40a7e4204c69',
        },
        {
          url: '/images/certified-black.svg',
          revision: 'df7dba2305b27a5f147b052190f136e7',
        },
        {
          url: '/images/color-wheel.png',
          revision: '61158ae47005df921af26d4752997431',
        },
        {
          url: '/images/dashboard/content.svg',
          revision: '86d43e201be79c2a3f09b98f78bb0fff',
        },
        {
          url: '/images/dashboard/election-over.svg',
          revision: 'b920e10e99fca2792c681f93b72feac1',
        },
        {
          url: '/images/dashboard/empty-dashboard.jpg',
          revision: '08b7bbfd7031a6b7f0b32db656249292',
        },
        {
          url: '/images/dashboard/funding.svg',
          revision: '277bfa99f691307776ce68c1de79a8c3',
        },
        {
          url: '/images/dashboard/mobilizing-icon.svg',
          revision: '2a9e3c7b2c622c2584219a115d19fdc6',
        },
        {
          url: '/images/dashboard/persona-icon.svg',
          revision: '67da942980f0be9f3209524e03debfe4',
        },
        {
          url: '/images/dashboard/plan.svg',
          revision: '657d5ae398f2a49d3700285efe49623b',
        },
        {
          url: '/images/dashboard/policies-icon.svg',
          revision: 'b3a0195411ea17547122c5ec5767f09c',
        },
        {
          url: '/images/dashboard/positioning-icon.svg',
          revision: '817961b783b86a03e763d872d6eb036a',
        },
        {
          url: '/images/dashboard/race-flag.svg',
          revision: '2ba3ba0b2ceff8740236e3debb6b2bec',
        },
        {
          url: '/images/dashboard/resources.svg',
          revision: '3a7da814d145cc28fac1203ba7158d2b',
        },
        {
          url: '/images/dashboard/running-icon.svg',
          revision: 'a31d233223e9c99f51b19f1f766ade2c',
        },
        {
          url: '/images/dashboard/slogan-icon.svg',
          revision: '7e45c88f809dca89d7f5092d173a8d28',
        },
        {
          url: '/images/dashboard/strategy-icon.svg',
          revision: 'bd987a9044252dd5f1148c106dab1e75',
        },
        {
          url: '/images/dashboard/team.svg',
          revision: '4e21a40ba98a29c67cf41a3fd30e37ef',
        },
        {
          url: '/images/dashboard/voter-icon.svg',
          revision: '5cd0b060f00b35aad7f24011e7d021f7',
        },
        {
          url: '/images/dashboard/wave.png',
          revision: '9c5fbe28d9f6f4c33cc694bf801fa98a',
        },
        {
          url: '/images/dashboard/website-icon.svg',
          revision: '135bf929d6bdc5e7511f07edf42d0feb',
        },
        {
          url: '/images/door-knocking/hourglass.png',
          revision: '4395228031df044f52b2b18076759e34',
        },
        {
          url: '/images/door-knocking/marker-clouds.svg',
          revision: '8e40e3777e5fb00da0dc094c3de74d77',
        },
        {
          url: '/images/election-results/meeting.jpg',
          revision: '8a8f5689f5a88d574abb431587744467',
        },
        {
          url: '/images/election-results/volunteer1.png',
          revision: 'df93416793370c870a99f1859f6e085b',
        },
        {
          url: '/images/election-results/volunteer2.png',
          revision: '7b5c681fe662d93f0ca502079bd0ef3e',
        },
        {
          url: '/images/elections/city-select.svg',
          revision: '8438ea99a85ca690d79acab81598b84b',
        },
        {
          url: '/images/elections/county-select.svg',
          revision: 'd1814a6538416e750f029f70d7b4424a',
        },
        {
          url: '/images/elections/dashboard.png',
          revision: 'd494d26834e15ee01e8928376697ad7c',
        },
        {
          url: '/images/elections/help.png',
          revision: '074e44507af0b567e37fb494a405d182',
        },
        {
          url: '/images/elections/map.png',
          revision: '82f5035cd9fa4bf548adc301a11dccb1',
        },
        {
          url: '/images/elections/mun-select.svg',
          revision: '8438ea99a85ca690d79acab81598b84b',
        },
        {
          url: '/images/elections/state-select.svg',
          revision: '42c1cb98cfec4a846fa32f5acf2875fd',
        },
        {
          url: '/images/elections/states/ak.png',
          revision: '67af9c2aff093702b0cd8b6f9b7ea4a9',
        },
        {
          url: '/images/elections/states/al.png',
          revision: '46db8831ca071c4fe4c9b70743a17b3e',
        },
        {
          url: '/images/elections/states/ar.png',
          revision: '2870fd4de5dcddce50b7c809b81d6253',
        },
        {
          url: '/images/elections/states/az.png',
          revision: '1ec667550ee9d5a1239586ff88f0d098',
        },
        {
          url: '/images/elections/states/ca.png',
          revision: '074b0df72796726ab67f17679004451c',
        },
        {
          url: '/images/elections/states/co.png',
          revision: '6b6ffff1e93a89d21a6dd94d1fd5becc',
        },
        {
          url: '/images/elections/states/ct.png',
          revision: 'c0f208e06bb358640f22705f14df7b27',
        },
        {
          url: '/images/elections/states/dc.png',
          revision: '7d09a997f2e30c5772a73810a9924f0b',
        },
        {
          url: '/images/elections/states/de.png',
          revision: '5eb861f88ee1b0fb7518b0304f20c384',
        },
        {
          url: '/images/elections/states/fl.png',
          revision: 'fe51346e99846e5994d13035d827784c',
        },
        {
          url: '/images/elections/states/ga.png',
          revision: '5bac21f4159d1bdcaf84524613c39f19',
        },
        {
          url: '/images/elections/states/hi.png',
          revision: '619c117750cc68b2b0e0330080f061b5',
        },
        {
          url: '/images/elections/states/ia.png',
          revision: 'a3ab78f0ae12f718601dc7bd277f050a',
        },
        {
          url: '/images/elections/states/id.png',
          revision: '6efd4532e3c577efc70af95de2b06adf',
        },
        {
          url: '/images/elections/states/il.png',
          revision: '7c7bbe702b39f589f4edfdf73efe1977',
        },
        {
          url: '/images/elections/states/in.png',
          revision: '5e475b6b62d5d69c89f8e95acf109616',
        },
        {
          url: '/images/elections/states/ks.png',
          revision: 'b20c05197a11668d9eae51a0de43ef23',
        },
        {
          url: '/images/elections/states/ky.png',
          revision: '4ecf9b039ac606b082bd042b4839c6af',
        },
        {
          url: '/images/elections/states/la.png',
          revision: '152b5bfe41de78854bb7084db200277a',
        },
        {
          url: '/images/elections/states/ma.png',
          revision: 'c861fdc7e8f12717a6a7b5d26f3ad404',
        },
        {
          url: '/images/elections/states/md.png',
          revision: '39f554b6606f14d468b7822946cd31bd',
        },
        {
          url: '/images/elections/states/me.png',
          revision: '1709dba7ce64cecf76cf08d848a174e2',
        },
        {
          url: '/images/elections/states/mi.png',
          revision: 'c72defb6ead42abd4a2a0fec316c14ac',
        },
        {
          url: '/images/elections/states/mn.png',
          revision: '875abf0e354d079da0d38e18de850319',
        },
        {
          url: '/images/elections/states/mo.png',
          revision: '663eda0bafa414ad39cfcf491c130c95',
        },
        {
          url: '/images/elections/states/ms.png',
          revision: '8f15f052e8d420ae0c388443dd5e9b8a',
        },
        {
          url: '/images/elections/states/mt.png',
          revision: '7be6512022f0d536adf3b03b5f94789e',
        },
        {
          url: '/images/elections/states/nc.png',
          revision: 'd85a3b759269fe3eebbb92dcb8ed1467',
        },
        {
          url: '/images/elections/states/nd.png',
          revision: 'e4c870106a9a40279020d6d0c27fac9c',
        },
        {
          url: '/images/elections/states/ne.png',
          revision: '12dc04a4844b34a793140259be437e18',
        },
        {
          url: '/images/elections/states/nh.png',
          revision: '3c879c44f4035900c5043b8c94798c8e',
        },
        {
          url: '/images/elections/states/nj.png',
          revision: '0cffc409c13cf4fc0b6e1754ec513815',
        },
        {
          url: '/images/elections/states/nm.png',
          revision: 'a28661af0296ab7ad9e6ee05119ff6a2',
        },
        {
          url: '/images/elections/states/nv.png',
          revision: '68549e5a31550d73f0f361dfa4d4c2a4',
        },
        {
          url: '/images/elections/states/ny.png',
          revision: 'a451dcc1c5e6808384b76d777a8f32fe',
        },
        {
          url: '/images/elections/states/oh.png',
          revision: 'f45d1f0fae4dfa52366643e033d42964',
        },
        {
          url: '/images/elections/states/ok.png',
          revision: 'f31bba26e20da0192b3a57d780e5aec4',
        },
        {
          url: '/images/elections/states/or.png',
          revision: 'eeba24dd73fde051fc59fdf312f026e3',
        },
        {
          url: '/images/elections/states/pa.png',
          revision: '07c6c55eed56ac4a3fdc1e268082cac3',
        },
        {
          url: '/images/elections/states/ri.png',
          revision: '76b3978bbc92499cc0d031f96df21f76',
        },
        {
          url: '/images/elections/states/sc.png',
          revision: 'd886652be803e2e343763464bdfa4a8b',
        },
        {
          url: '/images/elections/states/sd.png',
          revision: '1ceb129fe2800b99832e9a36f14553f9',
        },
        {
          url: '/images/elections/states/tn.png',
          revision: '3b1e21728f64baf9807405a0d672fe92',
        },
        {
          url: '/images/elections/states/tx.png',
          revision: '0324f1928e37638171f599ac4314fdc4',
        },
        {
          url: '/images/elections/states/ut.png',
          revision: 'bfd1953d4e17264b06886d6067c94648',
        },
        {
          url: '/images/elections/states/va.png',
          revision: 'a20fcd49d9187a4c482cfefe5e0e2eae',
        },
        {
          url: '/images/elections/states/vt.png',
          revision: '9a86afb09628b49171ebc6a0f4d0eb4b',
        },
        {
          url: '/images/elections/states/wa.png',
          revision: 'c0dfd21778e2e051a3cae3485a46d71e',
        },
        {
          url: '/images/elections/states/wi.png',
          revision: 'd37002b489d81b0c8169d49d91f042ed',
        },
        {
          url: '/images/elections/states/wv.png',
          revision: 'b5b7f99cfa3e1ca9da91f950e720e1e6',
        },
        {
          url: '/images/elections/states/wy.png',
          revision: 'aa426e0aea7317ed57a10fa6ad6d718b',
        },
        {
          url: '/images/error-pages/error-404.svg',
          revision: '8bd7ad77c1745e688f454b72fcd55592',
        },
        {
          url: '/images/error-pages/error-500.svg',
          revision: '1de0306d862e1db1cab18ff839ead79c',
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
          url: '/images/heart-hologram.svg',
          revision: '996fc7e76a89f5caf20a76fa11aba494',
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
          url: '/images/homepage-jan23/nashville.svg',
          revision: '93537fb975311865832b17e452910749',
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
          url: '/images/homepage/anne.jpg',
          revision: '7dbc32f079c0c97bc8887edf6e322d53',
        },
        {
          url: '/images/homepage/art.png',
          revision: '7019997973d5c29460f1eee7ce6478bc',
        },
        {
          url: '/images/homepage/banner-bg-1.png',
          revision: '1163783fa052e7b4507c48e5a2b741dc',
        },
        {
          url: '/images/homepage/bolts.svg',
          revision: '1d2a528a2f21532c4cd95b130c32d9b4',
        },
        {
          url: '/images/homepage/chaz.jpg',
          revision: 'b01b2f562417bf2f40ba8b8240127af0',
        },
        {
          url: '/images/homepage/circles.svg',
          revision: '4d0f1a1f57d43641cb19fd50d3380482',
        },
        {
          url: '/images/homepage/declare-independence.png',
          revision: '862779258fba896a2d8076aa96a8fbbd',
        },
        {
          url: '/images/homepage/dots.svg',
          revision: '27c8f967c71e701df8b8d1aae58e871c',
        },
        {
          url: '/images/homepage/genz.png',
          revision: '4dfb8ea4de015abddc9fa04f01bdd477',
        },
        {
          url: '/images/homepage/heart.svg',
          revision: '2362a200b52f92256b70423e6297bcff',
        },
        {
          url: '/images/homepage/hex.svg',
          revision: 'fbd2ac4a5f5bf372bfe5d8b43c355fe7',
        },
        {
          url: '/images/homepage/map.png',
          revision: 'df11efaed3c03e523557338ee8002114',
        },
        {
          url: '/images/homepage/peter.jpg',
          revision: '949ed5bf1b5e5a0c79d02a5de160615c',
        },
        {
          url: '/images/homepage/pie.svg',
          revision: '4ef7676a17cc9c0cbaca836772c463d2',
        },
        {
          url: '/images/homepage/progress.svg',
          revision: '9b7e1087f894a375006631b15af93428',
        },
        {
          url: '/images/homepage/software.png',
          revision: '1c21f0da57a52bed49a9828376640366',
        },
        {
          url: '/images/homepage/squiggles.svg',
          revision: '2ba4e6001643d4801b39455f2aae0510',
        },
        {
          url: '/images/homepage/tiktok-preview-sm.jpg',
          revision: '2bf212832e3360cf2f4d950fa92dba15',
        },
        {
          url: '/images/homepage/track.svg',
          revision: 'deb5d82116c9700626e2302f38264be3',
        },
        {
          url: '/images/icons/achievement.svg',
          revision: '82f9ec0f71b0f154df813def47bedd13',
        },
        {
          url: '/images/icons/party.svg',
          revision: 'bf72129fceaf2564eac363423ed352fb',
        },
        {
          url: '/images/landing-pages/about-candidates.png',
          revision: '35efce823fc7f8983bc5bad6b28cfa11',
        },
        {
          url: '/images/landing-pages/about-gp.png',
          revision: 'a8b6ff9685530bd63ab4353d5572607c',
        },
        {
          url: '/images/landing-pages/about-hero-sm.png',
          revision: '3a0b0241d3d5178f6f6223a1215db8f9',
        },
        {
          url: '/images/landing-pages/about-hero.png',
          revision: '20b4f5b457a3407b60aa2ff147f00640',
        },
        {
          url: '/images/landing-pages/about-voters.png',
          revision: '43780338fe43091ec82aaa2b7850637b',
        },
        {
          url: '/images/landing-pages/academy-jared.png',
          revision: '330a4f8cbb23c55c7a6b479e5c7347ec',
        },
        {
          url: '/images/landing-pages/academy-rich.png',
          revision: '9bb6d6c1febfda7a082db628b20fca19',
        },
        {
          url: '/images/landing-pages/academy-rob.png',
          revision: 'e42c44e55ca14bb3d6b61474bc2c4987',
        },
        {
          url: '/images/landing-pages/academy-zoom-window.png',
          revision: '502c737ea24681cc3ca5ec627b04ba23',
        },
        {
          url: '/images/landing-pages/academy.png',
          revision: 'fd11ca99cad3eefe4ed954e5f87a37e7',
        },
        {
          url: '/images/landing-pages/actionable-icon.svg',
          revision: '20395f27d796629eed9defe189b18f5e',
        },
        {
          url: '/images/landing-pages/ads-hero.jpg',
          revision: 'c3be37fb7a66e0b63e3e0632c7617815',
        },
        {
          url: '/images/landing-pages/arrow.svg',
          revision: '9ea07476ff1f1b0bc4bf24d8b45dbaf2',
        },
        {
          url: '/images/landing-pages/ballot-box.png',
          revision: '97bbc1fd34deb5f8869f770bb0431937',
        },
        {
          url: '/images/landing-pages/breanna.png',
          revision: '4b97964feb0506e881148232550130e8',
        },
        {
          url: '/images/landing-pages/breanna2.png',
          revision: 'cb48e15d811007be5cd9307ad27ccb7a',
        },
        {
          url: '/images/landing-pages/build-with-us-1.png',
          revision: '3a71dd8557269f497b078d2790c92663',
        },
        {
          url: '/images/landing-pages/build-with-us-2.png',
          revision: 'b5bba9e33a3e18667f4baa806e585508',
        },
        {
          url: '/images/landing-pages/calendar.png',
          revision: 'f04c04a05a55148598b100defb24a3d0',
        },
        {
          url: '/images/landing-pages/carlos.png',
          revision: '5b7a6cd4b383b6abada7f7fa2938f25b',
        },
        {
          url: '/images/landing-pages/change.png',
          revision: '886fcf3712cfbfa155d46160b833ad55',
        },
        {
          url: '/images/landing-pages/community.png',
          revision: '3b9139b245a0cbed6cc8cdd65db805d7',
        },
        {
          url: '/images/landing-pages/creativity.png',
          revision: 'c309e055a5de7cb6698573a7545cba76',
        },
        {
          url: '/images/landing-pages/curriculum.jpg',
          revision: '184538b39e7b3a7064bc77d3cf6acd8c',
        },
        {
          url: '/images/landing-pages/desyiah.png',
          revision: '4b06fbdc3d32658db1d792489b6d7f01',
        },
        {
          url: '/images/landing-pages/discord-people.png',
          revision: 'be80d33b4ecd7429d7fe547289ee31f8',
        },
        {
          url: '/images/landing-pages/discord-user1.png',
          revision: 'c322dfe8bde09d94c7c4463104670bb9',
        },
        {
          url: '/images/landing-pages/discord-user2.png',
          revision: 'a226528d34bc3811262273a050073c8c',
        },
        {
          url: '/images/landing-pages/discord-user3.png',
          revision: '0075dd02d6d26a4230172996428f4b51',
        },
        {
          url: '/images/landing-pages/discord-user4.png',
          revision: '88722a9255649cda161d7e5406138da1',
        },
        {
          url: '/images/landing-pages/discord-user5.png',
          revision: 'dbfe7c40f663f114ab891013bed51b23',
        },
        {
          url: '/images/landing-pages/discord.png',
          revision: '0c75469d601ff254e6021234782f0ad3',
        },
        {
          url: '/images/landing-pages/elected-leaders.png',
          revision: '5b944b8d248a4b039d85b391e0fa6ecf',
        },
        {
          url: '/images/landing-pages/electoral.png',
          revision: '8486f6fbe0bfbddeb12d168785e424bd',
        },
        {
          url: '/images/landing-pages/expert-icon.svg',
          revision: '8efdf37edaa196e0a4e771871a9ec59b',
        },
        {
          url: '/images/landing-pages/expert-jared.png',
          revision: '3b8d6353c00f4a5a147895f6e8188a3b',
        },
        {
          url: '/images/landing-pages/expert-rob.png',
          revision: '65b0afd91eb412c52e3e29a66440fb48',
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
          url: '/images/landing-pages/experts.png',
          revision: '7729437553623656f10afc16e9360efe',
        },
        {
          url: '/images/landing-pages/free-icon.svg',
          revision: 'f2cd16b63f3e809f60ebac39e113a7c1',
        },
        {
          url: '/images/landing-pages/friends.png',
          revision: '482d852eb8a1f4e076421d27ec28f311',
        },
        {
          url: '/images/landing-pages/hero-bg.png',
          revision: '758007bf6ef717dadfbe1d2297912953',
        },
        {
          url: '/images/landing-pages/impact.png',
          revision: '0a22f2e09556793b800259eae7b9c84a',
        },
        {
          url: '/images/landing-pages/info-people.png',
          revision: '3805a3b288ae3f2e2e93e92e71969781',
        },
        {
          url: '/images/landing-pages/insights.png',
          revision: 'e29ec69df533c69e6eef5a5d35d2f418',
        },
        {
          url: '/images/landing-pages/jared-budlong.jpg',
          revision: '0883bbd497902c599d37fc2b53061520',
        },
        {
          url: '/images/landing-pages/jarob.png',
          revision: '087b777ab7c21dab9015c139757e0600',
        },
        {
          url: '/images/landing-pages/kieryn-small.png',
          revision: '8c78f88a0fb9546cf9b332b008237a56',
        },
        {
          url: '/images/landing-pages/kieryn.png',
          revision: '3d12c29ed559bae3316f4036fddaab35',
        },
        {
          url: '/images/landing-pages/levelup.png',
          revision: '6ec1d52f7264c42e3b0a872e07bdcca4',
        },
        {
          url: '/images/landing-pages/lisa.png',
          revision: '8ab27a148416cf5b60767b11ae5d913c',
        },
        {
          url: '/images/landing-pages/local-results.png',
          revision: '06fcbeb75303c70b86686ccd7858355a',
        },
        {
          url: '/images/landing-pages/map-w-bubbles.png',
          revision: '2472123852aee16a2c4ec4a3c9b12cfd',
        },
        {
          url: '/images/landing-pages/map.png',
          revision: '95099d7f19a28e90891d86caa04c0e7d',
        },
        {
          url: '/images/landing-pages/megaphone.png',
          revision: '810b33c32d6b452d11b60728c8aea672',
        },
        {
          url: '/images/landing-pages/networking.png',
          revision: 'bea857070f38cb6726ea0af8c540b2f4',
        },
        {
          url: '/images/landing-pages/people.png',
          revision: 'a01ed6e235205ad8f1293beb2e3023b1',
        },
        {
          url: '/images/landing-pages/perks.png',
          revision: '44f6c180781138a0a8bf298a08b66c7b',
        },
        {
          url: '/images/landing-pages/red-bg-small.png',
          revision: '0a4b61d4fa382d6ee176cca8303a8c93',
        },
        {
          url: '/images/landing-pages/red-bg.png',
          revision: 'acb01ee1b137e1a92ae85a96fa969335',
        },
        {
          url: '/images/landing-pages/rob2.png',
          revision: '2cce56b8b956eaab40da4d9f5359fc68',
        },
        {
          url: '/images/landing-pages/rob3.png',
          revision: 'fcee72611461c34e851a438823de1c00',
        },
        {
          url: '/images/landing-pages/run-support.png',
          revision: 'c412477ec84c891873d9f91b35e30538',
        },
        {
          url: '/images/landing-pages/sal-davis.png',
          revision: '09c6fc12470a577678a6fb41d5c422de',
        },
        {
          url: '/images/landing-pages/spot-bg.svg',
          revision: '3ae845c3be2f4b6a73a91e9443215f6e',
        },
        {
          url: '/images/landing-pages/spot-gradient.svg',
          revision: '775632c3b571b543e643aabe202f5666',
        },
        {
          url: '/images/landing-pages/star.png',
          revision: '533c9eb9434d305ebefaae536a4fcda7',
        },
        {
          url: '/images/landing-pages/star.svg',
          revision: 'bb347e199d216ae2ff5edd5865af187e',
        },
        {
          url: '/images/landing-pages/team-hero.png',
          revision: '91889fd82bf1ee9f7f5bf7feb36fd4df',
        },
        {
          url: '/images/landing-pages/terry-c.png',
          revision: '89865effe7592f891b861554f332fc53',
        },
        {
          url: '/images/landing-pages/tools.png',
          revision: 'be9816e5effbfabb483f023516b83c91',
        },
        {
          url: '/images/landing-pages/viable-candidate.png',
          revision: 'fe57452b864100e1c06bd362daed75f4',
        },
        {
          url: '/images/landing-pages/victoria.png',
          revision: '574f4392d535fcf3a366cc481457f1f1',
        },
        {
          url: '/images/landing-pages/victoria2.png',
          revision: 'c5cf1a645f21419180b7fc6a83db60b0',
        },
        {
          url: '/images/landing-pages/volunteer-community.png',
          revision: 'f1ff346984265843cf54a4b35e73bac5',
        },
        {
          url: '/images/landing-pages/volunteer-default.png',
          revision: '173d6af0fe06d86b28e12b5639501f87',
        },
        {
          url: '/images/landing-pages/volunteer-fun.png',
          revision: 'fe9ac012a38ed9efc53c21fcbbb4e7bc',
        },
        {
          url: '/images/landing-pages/volunteer-hero.png',
          revision: '2bb47a9abc76147dab30b675889c9a94',
        },
        {
          url: '/images/landing-pages/volunteer-opportunities.png',
          revision: '6798e2111888e0009d37f0f20715a0bc',
        },
        {
          url: '/images/landing-pages/volunteer-partiers.png',
          revision: 'c0f916d943d6dbb10b7ed62c02fccbfa',
        },
        {
          url: '/images/landing-pages/volunteer-sm.jpg',
          revision: '84035e05c45fdf0ae01526e08dc45e08',
        },
        {
          url: '/images/landing-pages/volunteer-team.png',
          revision: '1122b0094095a850661471af4f9f485b',
        },
        {
          url: '/images/landing-pages/volunteer.jpg',
          revision: '8168ff584e48a3021f0b90ab062e7d90',
        },
        {
          url: '/images/landing-pages/webinar-hero.png',
          revision: 'c87f10a88118f9b9cdd6e0a82407b9d3',
        },
        {
          url: '/images/landing-pages/win.png',
          revision: 'bc2b7d21fdc7aaf3a575f89fc69eaef2',
        },
        {
          url: '/images/landing-pages/window-heart.svg',
          revision: '53878a8cb145ea025849c38ada74129e',
        },
        {
          url: '/images/landing-pages/winning-campaigns.png',
          revision: '0ec389d43671c836d06c3eacb8f476a1',
        },
        {
          url: '/images/landing-pages/winning-icon.svg',
          revision: '60173550b25d964d078718c5ef8902aa',
        },
        {
          url: '/images/landing-pages/yellow-star.svg',
          revision: 'f41d825f9d81eb30ec73f573c6d7460a',
        },
        {
          url: '/images/logo-hologram-white.svg',
          revision: 'fa08163866015aa7574866a9c4fb7f62',
        },
        {
          url: '/images/logo-hologram.svg',
          revision: '5618c543172f290816a5a49b9f4af88a',
        },
        {
          url: '/images/parties-logos/alliance-logo.png',
          revision: '0a0b4301f13a8677e3eda4abc592f576',
        },
        {
          url: '/images/parties-logos/democratic-logo.png',
          revision: '9998894210a69c8226c64aba8fac4e72',
        },
        {
          url: '/images/parties-logos/fwd-logo-transparent.png',
          revision: '0825b5d42a9af33757cda9b26120574c',
        },
        {
          url: '/images/parties-logos/fwd-logo.png',
          revision: '10f85ad4b9572a1af3d48022e7fe4ed4',
        },
        {
          url: '/images/parties-logos/fwd-vector-logo.svg',
          revision: '63869a5b0607e72b280f58092bcc9920',
        },
        {
          url: '/images/parties-logos/green-logo.png',
          revision: 'e9e8a30f2f0a4decbeeac60705ff2d10',
        },
        {
          url: '/images/parties-logos/independent.png',
          revision: '307bbad4a3d8b43faf15439f994214e0',
        },
        {
          url: '/images/parties-logos/libertarian-logo.png',
          revision: 'a2314553c025f8da37205ad89e85dea2',
        },
        {
          url: '/images/parties-logos/libertarian-torch-logo.png',
          revision: '9e49d73d9b065dff9427d9edbd2df55f',
        },
        {
          url: '/images/parties-logos/reform-logo.png',
          revision: 'd381ad0d90026f56a23349c1a1d93afa',
        },
        {
          url: '/images/parties-logos/republican-logo.png',
          revision: '08a2a467879b3d304c10fe06030122f6',
        },
        {
          url: '/images/parties-logos/wfp-logo.png',
          revision: 'a0954b5931df78a7e52906d5e4c139d7',
        },
        {
          url: '/images/people/colton.png',
          revision: '03e2b3578e7604f06a2402fcba73c0bb',
        },
        {
          url: '/images/people/mateo.png',
          revision: 'dd96ee4352219973a6d6edf9bc872e51',
        },
        {
          url: '/images/people/rob.png',
          revision: '6c930fac6f62023271b138b46418c497',
        },
        {
          url: '/images/qr/qr-door-knocking.png',
          revision: 'de107c020afb85a8e9a0406e674445f7',
        },
        {
          url: '/images/run-for-office/anne.jpg',
          revision: '7dbc32f079c0c97bc8887edf6e322d53',
        },
        {
          url: '/images/run-for-office/breanna.jpg',
          revision: 'c9136f9f042e93fc9322167a95bc74e7',
        },
        {
          url: '/images/run-for-office/campaign-tracker.png',
          revision: '89c9021036d24e225783f9828918c918',
        },
        {
          url: '/images/run-for-office/carlos.jpg',
          revision: 'a7fdbef176eb771f79b0c5a380e6a470',
        },
        {
          url: '/images/run-for-office/certified.png',
          revision: 'dfdccd42955171e4cac9e72b37d10bd1',
        },
        {
          url: '/images/run-for-office/cube.svg',
          revision: 'c42fa291cea2808a8d9a77b3d7167687',
        },
        {
          url: '/images/run-for-office/door-knocking.png',
          revision: 'ea8ebcc09a515bb9c29874f987bbbc21',
        },
        {
          url: '/images/run-for-office/experts.png',
          revision: '5f80f88563d55c3f32fc920bdc7064af',
        },
        {
          url: '/images/run-for-office/hero-large.png',
          revision: '330159ce28399562e721738a5c03e2eb',
        },
        {
          url: '/images/run-for-office/hero-star.svg',
          revision: '97208fac8a1fa668beadc4d9b434f041',
        },
        {
          url: '/images/run-for-office/map.png',
          revision: '50ebc63d19ba15f13c6934d574110b12',
        },
        {
          url: '/images/run-for-office/marty.png',
          revision: '7dfc9a1e68423f708a212304eca2deb1',
        },
        {
          url: '/images/run-for-office/my-content.png',
          revision: '24cf476b6224d1f81a3906a01806c18b',
        },
        {
          url: '/images/run-for-office/peter.jpg',
          revision: '949ed5bf1b5e5a0c79d02a5de160615c',
        },
        {
          url: '/images/run-for-office/platform.png',
          revision: 'e39bf8aba76c746bdd07a5f7218324f4',
        },
        {
          url: '/images/run-for-office/run-hero.png',
          revision: '378bb698bb5c7e778b4e46f510061971',
        },
        {
          url: '/images/run-for-office/squiggles.svg',
          revision: '2ba4e6001643d4801b39455f2aae0510',
        },
        {
          url: '/images/run-for-office/terry-c.png',
          revision: '4149095d715f7edc1f03ba5907b102aa',
        },
        {
          url: '/images/run-for-office/terry.png',
          revision: '922609a4b7bb0c2f6c353ebb415b4fb4',
        },
        {
          url: '/images/run-for-office/triangles.svg',
          revision: '2127abeaac6aa1d7e3fb4a2a7241a108',
        },
        {
          url: '/images/run-for-office/victoria.jpg',
          revision: 'c5617f237538b7ce6f5857a15ae31a6c',
        },
        {
          url: '/images/white-logo.svg',
          revision: '52df5d6da0da24b89ea391729f0d3f73',
        },
        { url: '/manifest.json', revision: 'ffd8fbc49e62aa5741e261be36cc1a4a' },
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
              event: i,
              state: s,
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
