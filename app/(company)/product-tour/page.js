import React from 'react';
import MaxWidth from '@shared/layouts/MaxWidth';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'AI Campaign Manager Product Tour | GOOD PARTY',
  description:
    "Take a walkthrough of Good Party's flagship product, AI Campaign Manager. Learn how it helps campaigns refine their strategy, track progress, and create content to run efficient and successful campaigns.",
  slug: '/product-tour',
});
export const metadata = meta;

export default function Page() {
  return (
    <MaxWidth>
      <div className="w-[80vw] max-w-[900px] h-[90vh]">
        <iframe
          src="https://capture.navattic.com/clnkk83pm00m208l76gq2arcm"
          width="100%"
          height="100%"
          allow="fullscreen"
        ></iframe>
      </div>
    </MaxWidth>
  );
}
