if(!self.define){let e,a={};const s=(s,i)=>(s=new URL(s+".js",i).href,a[s]||new Promise((a=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=a,document.head.appendChild(e)}else e=s,importScripts(s),a()})).then((()=>{let e=a[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(i,n)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(a[c])return;let t={};const r=e=>s(e,c),o={module:{uri:c},exports:t,require:r};a[c]=Promise.all(i.map((e=>o[e]||r(e)))).then((e=>(n(...e),t)))}}define(["./workbox-588899ac"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"ac908a3277b18b1bc4e01fd6b98406b9"},{url:"/_next/static/N1rSuNviRHOaUzGqoB_sp/_buildManifest.js",revision:"6cf87bde41defd5c4533f947d0608dba"},{url:"/_next/static/N1rSuNviRHOaUzGqoB_sp/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/0c428ae2-199a19a4403ddb54.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/1148-97a5c85dd1227617.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/1290.6413295863f929fb.js",revision:"6413295863f929fb"},{url:"/_next/static/chunks/1405-e9dd18bf3577fb04.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/1568-9f5800e64d868c59.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/17-668e9207e66304f9.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/1804-a17b842b683ddd3b.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/1bfc9850-9a2f969fda454eaf.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/2086-d4df966124698fcd.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/2307-445870c5d072f648.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/2400-e39b78b3145af52a.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/251-11f12d1155dc4692.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/2510-a63bb2aa00e71eb1.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/252f366e-85e5850987f4bd9c.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/2600-6fc1d44abbffb993.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/2677-f110d74f5afda602.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/2975-248883fd1a7549db.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/30-423d8d26d4815e80.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/31664189-d10e5b4e6e1a354d.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/3323-5ebf956d23adaf44.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/3528-14f89841e897bf19.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/4090-414f07b201ad7623.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/4444-b1b64c2152d4d9f2.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/4808.3049c307d9f7d056.js",revision:"3049c307d9f7d056"},{url:"/_next/static/chunks/5172-4e7fa61a5e09588b.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/5501.db9fa7913385a231.js",revision:"db9fa7913385a231"},{url:"/_next/static/chunks/5532-73941b291c872938.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/5619.ee8c96c84ffd7b37.js",revision:"ee8c96c84ffd7b37"},{url:"/_next/static/chunks/5759-0a5744147f0c5f0e.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/5958.0c3644aa512d6391.js",revision:"0c3644aa512d6391"},{url:"/_next/static/chunks/6058-fcfd131aac255dfb.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/6284-8c035bcbfb5d8ea2.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/6435-feef7dc5d2c91f04.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/6560-20f065688cff31cb.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/6677-0e1a2060aaad3ea2.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/672-5c909b1306aff73c.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/6752-26654a84c38363dd.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/6878-c7fc161c3c9d4010.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/6992-ed0b10350b44377c.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/7169-488be5c4b5b4ce84.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/717-b2ff6e6fbf8dbf62.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/7461.18c902a269b0d598.js",revision:"18c902a269b0d598"},{url:"/_next/static/chunks/7727-1db08973f010e137.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/787-6575da16e6cd1330.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/78e521c3-4fe6e9901568cce7.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/7925-3339718ee3f086f1.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/8035.feba8a7bcd18356f.js",revision:"feba8a7bcd18356f"},{url:"/_next/static/chunks/8137-810819907c45fbee.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/83-8c654c402692699d.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/8380.97cbdeabbfe09e7f.js",revision:"97cbdeabbfe09e7f"},{url:"/_next/static/chunks/8552-9124455bebb9ad55.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/8614-82a56f0681f807cf.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/907-68f197f52a1fcef5.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/9375-0fb548300bf20e44.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/9411-7c5718346d5f61dd.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/95b64a6e-6b36af4fa5d4aaa5.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/9617.8c660728ac59dca9.js",revision:"8c660728ac59dca9"},{url:"/_next/static/chunks/9623.664ecf0fcee721a9.js",revision:"664ecf0fcee721a9"},{url:"/_next/static/chunks/9719.27c53a134a820376.js",revision:"27c53a134a820376"},{url:"/_next/static/chunks/9768.b2783316b7b7122d.js",revision:"b2783316b7b7122d"},{url:"/_next/static/chunks/9828-13169d86eb159a47.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/a0e03aaa-9c7dc3cc38e409d2.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/admin/head-f36dc8ccf2a5dee4.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/admin/page-f563ac60e4deec70.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/edit-campaign/head-0bda4554b2a2ede1.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/edit-campaign/page-ae52585c398e6c6f.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/endorsements/head-f57b92134a39cea8.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/endorsements/page-19174a06f4c93595.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/head-f1a03202c043ec62.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/page-1870eb17568cb5a3.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/top-issues/head-5b8c6f330bbc550f.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/candidate-portal/%5Bid%5D/top-issues/page-31604c36490916c2.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/goals/about-opponent/head-576352f3780715c6.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/goals/about-opponent/page-53990972db4197c3.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/goals/more-info/head-8c16284834e47328.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/goals/more-info/page-a67d66f91d719c54.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/goals/opponent-self/head-c0831fb02871027c.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/goals/opponent-self/page-2922aa7e6353dfa2.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/goals/opponent/head-25e1729c35d5f749.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/goals/opponent/page-7ed2cffe2a2d8d88.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/goals/what/head-2f2b9f6122ad9fcb.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/goals/what/page-618334b5c218dcd5.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/goals/why/head-fabe3c59d3d59bf8.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/goals/why/page-ff9a8fdb5bf857fc.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/pledge/head-b301df212a30913b.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/pledge/page-97129d656890f4bd.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/strategy/who-are-you/head-1a61586eb2b1821b.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/strategy/who-are-you/page-f188a71500b5f58e.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/strategy/why-best-choice/head-2f93dcb305c8a59b.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/strategy/why-best-choice/page-41a3e787ffdbc4d3.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/strategy/why-running/head-20e40c89d6be6ba2.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/onboarding/%5Bslug%5D/strategy/why-running/page-08e3dad6290e4e4f.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/onboarding/ai/head-510213039f18bc23.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/onboarding/ai/page-7f92aa88d588f3b4.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/onboarding/head-2a0dcb98aede9d5f.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(candidate)/onboarding/page-53bd3973879430fd.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(company)/about/error-956b45007414be8d.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(company)/about/head-1cf8fefd5c15fe45.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(company)/about/page-5277ff83d9f8ff12.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(company)/contact/head-635bd64a3468f994.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(company)/contact/page-a4a670c46d657389.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(company)/pricing/head-22a4200b34ad660a.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(company)/pricing/page-228db99d9faee101.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(company)/privacy/head-ebea55e475252ba1.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(company)/privacy/page-430d4bf89c19a0bf.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(company)/run-for-office/head-9a81b6bebf2a45d8.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(company)/run-for-office/page-e4c154f73427c3a8.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(company)/team/error-54f96da6092731af.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(company)/team/head-1a62ccbccedbc2a8.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(company)/team/page-189b19a562ffd588.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(company)/volunteer/head-e436dd10953c0b7a.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(company)/volunteer/page-cc019fce70a5f812.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(company)/work-with-us/head-afa28fdb27331952.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(company)/work-with-us/page-fc0bfaa251f86a86.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(entrance)/forgot-password/head-6a71344ee11ff9c4.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(entrance)/forgot-password/page-0d539d5273a9c3cd.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(entrance)/login/head-7a7b8ede9060fdb1.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(entrance)/login/page-94912a478ff5a90a.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(entrance)/register/head-530555d99d3ddd96.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(entrance)/register/page-683baf530964baa2.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(entrance)/reset-password/head-ca9468003b10f919.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(entrance)/reset-password/page-23aa936c617bd4d6.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(entrance)/twitter-callback/head-b5a4691c258c3d09.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(entrance)/twitter-callback/page-bd0acfee4454f6a2.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(user)/profile/error-7463862279e964db.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(user)/profile/head-0b2180235a2901b2.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(user)/profile/layout-7aa4f704c4251cfc.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(user)/profile/page-1f7253c6a3fbf19b.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(user)/profile/settings/head-090bd3581dd766dc.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/(user)/profile/settings/page-0a302dac014796dd.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/admin/add-candidate/head-51ad6700e23c6b30.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/admin/add-candidate/page-f5bfbd66693376f8.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/admin/candidates/head-b67e9e80f7179e05.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/admin/candidates/page-c3f204b84e003f82.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/admin/head-034418534e9ed281.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/admin/page-e0a81d7145b03922.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/admin/top-issues/head-63e7e988f62ed5d7.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/admin/top-issues/page-5c59449ff78b2b05.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/admin/users/head-761ed16be58d77f8.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/admin/users/page-489b1a6eb6d1d221.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/blog/article/%5Bslug%5D/head-dda20d8b971b5ef6.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/blog/article/%5Bslug%5D/page-91ea919879345bce.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/blog/head-674d7b1ba71af916.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/blog/page-b331f65d67e22134.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/blog/section/%5Bslug%5D/head-cb5348566d3368dc.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/blog/section/%5Bslug%5D/page-092b1c2d6bc39a32.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/candidate/%5B...oldSlug%5D/page-d00e37d23321ba20.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/candidate/%5Bslug%5D/head-8c8b819d8eb52bb7.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/candidate/%5Bslug%5D/page-26c7ff391d52598d.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/candidates/%5B%5B...filters%5D%5D/head-a6b3e411fa87124d.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/candidates/%5B%5B...filters%5D%5D/page-270182a58e261a74.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/faqs/%5B...titleId%5D/head-0d61686ae122da4f.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/faqs/%5B...titleId%5D/page-a98bab3704973a61.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/faqs/head-a827dd928f513b8a.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/faqs/page-9c1b30f013d3f5a9.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/head-9dcd67fa420da2ae.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/layout-0a8781676cb9c83d.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/page-c26255888aa29f41.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/political-terms/%5Bslug%5D/head-ef24516461d07d92.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/political-terms/%5Bslug%5D/page-b3b73d91b5423289.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/political-terms/head-aae47b2f123d050e.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/app/political-terms/page-f9af5372c710c73e.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/b98bc7c3-6845e68a01b8fc83.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/d64684d8-39ce0715f2ab046f.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/f70991a6-8d09a24effa6a57e.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/main-5d359c8d98ba4abb.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/main-app-938d202940bc9fa0.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/pages/_app-cbe2c9d1e8e75269.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/pages/_error-7eb2326bfea6ee40.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-8f917c2053033c2b.js",revision:"N1rSuNviRHOaUzGqoB_sp"},{url:"/_next/static/css/0066814787c03d95.css",revision:"0066814787c03d95"},{url:"/_next/static/css/08f3171ea9aca7c4.css",revision:"08f3171ea9aca7c4"},{url:"/_next/static/css/1101abea72c71778.css",revision:"1101abea72c71778"},{url:"/_next/static/css/16d7bfb39aa9a2eb.css",revision:"16d7bfb39aa9a2eb"},{url:"/_next/static/css/1815c20a37e59b58.css",revision:"1815c20a37e59b58"},{url:"/_next/static/css/34379bcbbbe02add.css",revision:"34379bcbbbe02add"},{url:"/_next/static/css/3b062c2d58e4ff3e.css",revision:"3b062c2d58e4ff3e"},{url:"/_next/static/css/44da829cb30b36b5.css",revision:"44da829cb30b36b5"},{url:"/_next/static/css/5055336e6c0f9207.css",revision:"5055336e6c0f9207"},{url:"/_next/static/css/550e48b0eca94933.css",revision:"550e48b0eca94933"},{url:"/_next/static/css/566c7bd3b58496f8.css",revision:"566c7bd3b58496f8"},{url:"/_next/static/css/5885bc9342ff0d0b.css",revision:"5885bc9342ff0d0b"},{url:"/_next/static/css/5ccd422c581bc571.css",revision:"5ccd422c581bc571"},{url:"/_next/static/css/6490b1291f7822d7.css",revision:"6490b1291f7822d7"},{url:"/_next/static/css/720670cf02a24e56.css",revision:"720670cf02a24e56"},{url:"/_next/static/css/9b90fe812ff8f9b7.css",revision:"9b90fe812ff8f9b7"},{url:"/_next/static/css/a140fd6c6e4de785.css",revision:"a140fd6c6e4de785"},{url:"/_next/static/css/af8f94c806c1fd0c.css",revision:"af8f94c806c1fd0c"},{url:"/_next/static/css/b140b2b33ba82afc.css",revision:"b140b2b33ba82afc"},{url:"/_next/static/css/b29243add46305f0.css",revision:"b29243add46305f0"},{url:"/_next/static/css/b53470d0b0978fa3.css",revision:"b53470d0b0978fa3"},{url:"/_next/static/css/b8e31c6b10a064f8.css",revision:"b8e31c6b10a064f8"},{url:"/_next/static/css/c9538334b4637d87.css",revision:"c9538334b4637d87"},{url:"/_next/static/css/cad1ce54bdf09886.css",revision:"cad1ce54bdf09886"},{url:"/_next/static/css/cbc4686497573fea.css",revision:"cbc4686497573fea"},{url:"/_next/static/css/fe50755fdf2c6a15.css",revision:"fe50755fdf2c6a15"},{url:"/_next/static/media/1502bd213e25ba3e.woff2",revision:"a9c7c20a417a34a9d017176b563cfb64"},{url:"/_next/static/media/28777f2d837b799c.p.woff2",revision:"e7e52c955aa33e618baf437a16539524"},{url:"/_next/static/media/400b60eed27dfb33.p.woff2",revision:"69b28056044be6438ce7e5214c66ba82"},{url:"/_next/static/media/633da1f25676cae8.woff2",revision:"5bc5e06e2c36c36d2afbb4321dfc8697"},{url:"/_next/static/media/7bb39e817a36d930.p.woff2",revision:"89516c332e4454cfd3caa1b52cea919b"},{url:"/_next/static/media/880988045e8ce30f.p.woff2",revision:"5589842cc46587294240b2cc0c7a0f98"},{url:"/_next/static/media/9626065e32893d49.woff2",revision:"f0f8f93fabb6ff890ec4603e72d551f8"},{url:"/_next/static/media/ajax-loader.0b80f665.gif",revision:"0b80f665"},{url:"/_next/static/media/dd7e11d97e6f9605.woff2",revision:"09032bab78b9b7fca9b00427ae4083f0"},{url:"/_next/static/media/expert-small.55d21594.png",revision:"3da68ff3c349e0c8ab05809dff497cd9"},{url:"/_next/static/media/expert.7411ad3f.png",revision:"55cd46c3cb268dce911ac36466887ba3"},{url:"/_next/static/media/faq-hero.db04c1bf.jpeg",revision:"ac3ed1e7ffbec3e025d77008c6138f21"},{url:"/_next/static/media/hero-bg.3b195183.png",revision:"758007bf6ef717dadfbe1d2297912953"},{url:"/_next/static/media/homepage-candidates.6817135d.png",revision:"57613eaca06fb35665aba60309442628"},{url:"/_next/static/media/homepage-voters.2056a33a.png",revision:"cc0f984987731c2147a3df9c25740e00"},{url:"/_next/static/media/people.e75cbf41.png",revision:"a01ed6e235205ad8f1293beb2e3023b1"},{url:"/_next/static/media/red-bg-small.ec6cdc49.png",revision:"0a4b61d4fa382d6ee176cca8303a8c93"},{url:"/_next/static/media/red-bg.0e678779.png",revision:"acb01ee1b137e1a92ae85a96fa969335"},{url:"/_next/static/media/slick.25572f22.eot",revision:"25572f22"},{url:"/_next/static/media/slick.653a4cbb.woff",revision:"653a4cbb"},{url:"/_next/static/media/slick.6aa1ee46.ttf",revision:"6aa1ee46"},{url:"/_next/static/media/slick.f895cfdf.svg",revision:"f895cfdf"},{url:"/_next/static/media/team.0d008a5e.png",revision:"8ce12b300de972305373a2844e21aa9d"},{url:"/_next/static/media/volunteer-community.0ba39887.png",revision:"f1ff346984265843cf54a4b35e73bac5"},{url:"/_next/static/media/volunteer-default.7877f986.png",revision:"173d6af0fe06d86b28e12b5639501f87"},{url:"/_next/static/media/volunteer-fun.29d1f12b.png",revision:"fe9ac012a38ed9efc53c21fcbbb4e7bc"},{url:"/_next/static/media/volunteer-opportunities.24d37c89.png",revision:"6798e2111888e0009d37f0f20715a0bc"},{url:"/_next/static/media/volunteer-partiers.04c16bae.png",revision:"c0f916d943d6dbb10b7ed62c02fccbfa"},{url:"/_next/static/media/volunteer-sm.d50e3ed6.jpg",revision:"84035e05c45fdf0ae01526e08dc45e08"},{url:"/_next/static/media/volunteer-team.1927cfb0.png",revision:"1122b0094095a850661471af4f9f485b"},{url:"/_next/static/media/volunteer.16f2f0a7.png",revision:"9686dfbf92e49af23a457e0e0d37479d"},{url:"/_next/static/media/volunteer.5db16b47.jpg",revision:"8168ff584e48a3021f0b90ab062e7d90"},{url:"/_next/static/media/your-name.fa9d97fe.jpg",revision:"a59176edf74a54dca946b55a5357d7fe"},{url:"/favicon.ico",revision:"802717f7b2a0c5379133a794cded7c8c"},{url:"/images/black-logo.svg",revision:"8b1420010774a47267eb29cced8ed21b"},{url:"/images/certified-black.svg",revision:"df7dba2305b27a5f147b052190f136e7"},{url:"/images/faqs/faq-hero.jpeg",revision:"ac3ed1e7ffbec3e025d77008c6138f21"},{url:"/images/favicons/android-icon-144x144.png",revision:"93c519b9432f7e25b9a507cb71a75f1d"},{url:"/images/favicons/android-icon-192x192.png",revision:"ea26bf93e041c00df8c564630e38ee0b"},{url:"/images/favicons/android-icon-36x36.png",revision:"d855376dd1d584cbdca93633b674a1dc"},{url:"/images/favicons/android-icon-48x48.png",revision:"f40a9145a527a2957d1923e62d9035e4"},{url:"/images/favicons/android-icon-72x72.png",revision:"b3ebf8a83309b2a96de55c0f7980ce87"},{url:"/images/favicons/android-icon-96x96.png",revision:"0d09a5977fe2e993e19fc40a2c71aa6d"},{url:"/images/favicons/apple-icon-114x114.png",revision:"f75a4f0416d828476fd26da2b3a450a4"},{url:"/images/favicons/apple-icon-120x120.png",revision:"c9b11aaacb3ca30fa10cb8338a1eb3f6"},{url:"/images/favicons/apple-icon-144x144.png",revision:"93c519b9432f7e25b9a507cb71a75f1d"},{url:"/images/favicons/apple-icon-152x152.png",revision:"77831c594e767d5ff3a5e7e8573b4d56"},{url:"/images/favicons/apple-icon-180x180.png",revision:"562a4ddb31ba31950e09d1d77a47d8ce"},{url:"/images/favicons/apple-icon-57x57.png",revision:"b775a636e5e31a2b0ffbe41293ef04c5"},{url:"/images/favicons/apple-icon-60x60.png",revision:"b183026c2b02fcc579ac8219d75423df"},{url:"/images/favicons/apple-icon-72x72.png",revision:"b3ebf8a83309b2a96de55c0f7980ce87"},{url:"/images/favicons/apple-icon-76x76.png",revision:"69c9b9b541a45589a3966b7098e49ce5"},{url:"/images/favicons/apple-icon-precomposed.png",revision:"2accdcd14ef43c617e3e8a6fd220cc33"},{url:"/images/favicons/apple-icon.png",revision:"2accdcd14ef43c617e3e8a6fd220cc33"},{url:"/images/favicons/browserconfig.xml",revision:"653d077300a12f09a69caeea7a8947f8"},{url:"/images/favicons/favicon-16x16.png",revision:"22e666e753d89f71025d392ca737149c"},{url:"/images/favicons/favicon-32x32.png",revision:"59a43323aa6f5c8bcebc22858fd8844b"},{url:"/images/favicons/favicon-512x512.png",revision:"f9c7b4377573f49892338c58f8fcbde4"},{url:"/images/favicons/favicon-96x96.png",revision:"0d09a5977fe2e993e19fc40a2c71aa6d"},{url:"/images/favicons/favicon.ico",revision:"802717f7b2a0c5379133a794cded7c8c"},{url:"/images/favicons/ms-icon-144x144.png",revision:"93c519b9432f7e25b9a507cb71a75f1d"},{url:"/images/favicons/ms-icon-150x150.png",revision:"b09b866f516b8c4f1893d3552594966b"},{url:"/images/favicons/ms-icon-310x310.png",revision:"3555c694e6026e44d7ec2bb5510493ea"},{url:"/images/favicons/ms-icon-70x70.png",revision:"1d7058a53a9e078e878f1b29bdb84873"},{url:"/images/heart.svg",revision:"afb811998bad9271de9f195d6b0bf57f"},{url:"/images/homepage-jan23/homepage-candidates.png",revision:"57613eaca06fb35665aba60309442628"},{url:"/images/homepage-jan23/homepage-voters.png",revision:"cc0f984987731c2147a3df9c25740e00"},{url:"/images/homepage-jan23/team.png",revision:"8ce12b300de972305373a2844e21aa9d"},{url:"/images/homepage-jan23/volunteer.png",revision:"9686dfbf92e49af23a457e0e0d37479d"},{url:"/images/homepage-jan23/your-name.jpg",revision:"a59176edf74a54dca946b55a5357d7fe"},{url:"/images/homepage/banner-bg-1.png",revision:"1163783fa052e7b4507c48e5a2b741dc"},{url:"/images/homepage/declare-independence.png",revision:"862779258fba896a2d8076aa96a8fbbd"},{url:"/images/homepage/tiktok-preview-sm.jpg",revision:"2bf212832e3360cf2f4d950fa92dba15"},{url:"/images/icons/achievement.svg",revision:"82f9ec0f71b0f154df813def47bedd13"},{url:"/images/landing-pages/expert-small.png",revision:"3da68ff3c349e0c8ab05809dff497cd9"},{url:"/images/landing-pages/expert.png",revision:"55cd46c3cb268dce911ac36466887ba3"},{url:"/images/landing-pages/hero-bg.png",revision:"758007bf6ef717dadfbe1d2297912953"},{url:"/images/landing-pages/people.png",revision:"a01ed6e235205ad8f1293beb2e3023b1"},{url:"/images/landing-pages/red-bg-small.png",revision:"0a4b61d4fa382d6ee176cca8303a8c93"},{url:"/images/landing-pages/red-bg.png",revision:"acb01ee1b137e1a92ae85a96fa969335"},{url:"/images/landing-pages/volunteer-community.png",revision:"f1ff346984265843cf54a4b35e73bac5"},{url:"/images/landing-pages/volunteer-default.png",revision:"173d6af0fe06d86b28e12b5639501f87"},{url:"/images/landing-pages/volunteer-fun.png",revision:"fe9ac012a38ed9efc53c21fcbbb4e7bc"},{url:"/images/landing-pages/volunteer-opportunities.png",revision:"6798e2111888e0009d37f0f20715a0bc"},{url:"/images/landing-pages/volunteer-partiers.png",revision:"c0f916d943d6dbb10b7ed62c02fccbfa"},{url:"/images/landing-pages/volunteer-sm.jpg",revision:"84035e05c45fdf0ae01526e08dc45e08"},{url:"/images/landing-pages/volunteer-team.png",revision:"1122b0094095a850661471af4f9f485b"},{url:"/images/landing-pages/volunteer.jpg",revision:"8168ff584e48a3021f0b90ab062e7d90"},{url:"/manifest.json",revision:"82835d3211b2cd209c04c2fbb2e56fe6"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:a,event:s,state:i})=>a&&"opaqueredirect"===a.type?new Response(a.body,{status:200,statusText:"OK",headers:a.headers}):a}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const a=e.pathname;return!a.startsWith("/api/auth/")&&!!a.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
