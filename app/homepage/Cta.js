'use client';
import MaxWidth from '@shared/layouts/MaxWidth';
import Pill from '@shared/buttons/Pill';
import Link from 'next/link';

export default function Cta() {
  return (
    <MaxWidth>
      <div className="flex items-center text-center flex-col w-full pb-20 pt-12">
        <h3 className="font-semibold text-4xl mb-12">
          Any questions? Schedule a demo with our team
        </h3>
        <div>
          <Link href="/get-a-demo" id="prefooter_demo">
            <Pill outlined className="w-48 cursor-pointer">
              <div className="tracking-wide ">GET A DEMO</div>
            </Pill>
          </Link>
        </div>
      </div>
    </MaxWidth>
  );
}
