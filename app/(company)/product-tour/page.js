import React from 'react';
import pageMetaData from 'helpers/metadataHelper';
import H2 from '@shared/typography/H2';
import H3 from '@shared/typography/H3';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import Link from 'next/link';

export const revalidate = 3600;
export const dynamic = 'force-static';

const meta = pageMetaData({
  title: 'AI Campaign Manager Product Tour | GoodParty.org',
  description:
    "Take a walkthrough of GoodParty.org's flagship product, AI Campaign Manager. Learn how it helps campaigns refine their strategy, track progress, and create content to run efficient and successful campaigns.",
  slug: '/product-tour',
});
export const metadata = meta;

export default function Page() {
  return (
    <>
      <div className="md:hidden text-center p-10">
        <H2 className="p-5">
          The Interactive Tour is not available on mobile.
        </H2>
        <H3 className="p-5">
          Please come back and view this page on a desktop device.
        </H3>
        <Link href="/run-for-office">
          <div className="flex justify-center p-5">
            <PrimaryButton>Learn More</PrimaryButton>
          </div>
        </Link>
      </div>
      <div className="w-[100%] h-screen hidden md:block">
        <iframe
          src="https://capture.navattic.com/clnkk83pm00m208l76gq2arcm"
          width="100%"
          height="100%"
          allow="fullscreen"
        ></iframe>
      </div>
    </>
  );
}
