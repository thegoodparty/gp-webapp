'use client';
import MaxWidth from '@shared/layouts/MaxWidth';
import Pill from '@shared/buttons/Pill';
import Link from 'next/link';

export default function Cta() {
  return (
    <MaxWidth className="bg-slate-50">
      <div className="flex items-center flex-col w-full">
        <h3 className=" font-semibold text-4xl pb-12">
          Any questions? Schedule a demo with our team
        </h3>
        <div>
          <Link
            href="/get-a-demo"
            id="experts-demo-btn"
            className="pb-20 block"
          >
            <Pill outlined className="w-48">
              <div className="tracking-wide">GET A DEMO</div>
            </Pill>
          </Link>
        </div>
      </div>
    </MaxWidth>
  );
}
