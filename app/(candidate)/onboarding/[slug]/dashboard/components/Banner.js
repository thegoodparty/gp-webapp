'use client';
import Link from 'next/link';

export default function Banner({ campaign }) {
  const { launchStatus, candidateSlug, slug } = campaign;
  return (
    <div className="pb-8">
      {launchStatus === 'launched' ? (
        <div className="p-2  text-center bg-green-600 text-white">
          Your campaign is launched.
          <br />
          <Link
            href={`/candidate/${candidateSlug || slug}`}
            className="underline mt-1 text-lg"
          >
            Your Campaign
          </Link>
        </div>
      ) : null}
      {launchStatus === 'pending' ? (
        <div className="p-2 text-lg text-center bg-black text-white">
          Your campaign launch is pending a review.
        </div>
      ) : null}
    </div>
  );
}
