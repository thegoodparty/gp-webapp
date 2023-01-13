import PurpleButton from '@shared/buttons/PurpleButton';
import Link from 'next/link';

export default function WhatIs() {
  return (
    <div
      className="border-t border-b border-neutral-300 py-6 grid grid-cols-12 gap-3 items-center"
      style={{ borderColor: '#D3D3D3' }}
    >
      <div className="col-span-12 lg:col-span-10">
        <h3 className="text-lg font-light">WHAT IS GOOD PARTY</h3>
        <div className="font-black text-2xl">
          We help first-time and incumbent independent candidates run better
          campaigns. Get access to free tools and expert knowledge to reach the
          voters, volunteers, and donors you need without the party politics.
        </div>
      </div>
      <div className="hidden lg:block col-span-2">
        <Link href="/about">
          <PurpleButton style={{ borderRadius: '40px', width: '100%' }}>
            <div className="whitespace-nowrap font-black text-xl">
              LEARN HOW
            </div>
          </PurpleButton>
        </Link>
      </div>
    </div>
  );
}
