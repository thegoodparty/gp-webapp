import PrimaryButton from '@shared/buttons/PrimaryButton';
import MaxWidth from '@shared/layouts/MaxWidth';
import { Anton } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

const anoton = Anton({ weight: '400', subsets: ['latin'] });

export default function Hero() {
  return (
    <MaxWidth>
      <div className="py-12 text-center">
        <h1>
          <span className="text-4xl md:text-5xl text-gray-600">
            It&apos;s time to show that the
          </span>
          <span
            className={`block text-5xl md:text-7xl text-primary-dark mt-4 ${anoton.className}`}
          >
            MAJORITY
          </span>
          <span className="block text-4xl md:text-5xl text-gray-600 mt-8">
            of us are
          </span>
          <span
            className={`block text-5xl md:text-7xl text-primary-dark mt-4 ${anoton.className}`}
          >
            INDEPENDENTS
          </span>
        </h1>
        <h2 className="mt-14 font-medium text-xl">
          <div className="flex items-center justify-center ">
            <span>Get your FREE </span>
            <Image
              className=" -rotate-[30deg] ml-3 mr-1"
              src="/images/heart-hologram.svg"
              data-cy="logo"
              width={54}
              height={42}
              alt="GoodParty.org"
              priority
            />

            <span>Stickers</span>
          </div>
          <div>to #BrightenAmerica</div>
        </h2>
        <div className="grid grid-cols-12 gap-4 mt-8">
          <div className="col-span-12 md:col-span-4">
            <Link href="/get-stickers#get-stickers">
              <PrimaryButton className="mt-8">Send Me Stickers!</PrimaryButton>
            </Link>
          </div>
          <div className="col-span-12 md:col-span-4">
            <Link href="/run-for-office">
              <PrimaryButton className="mt-8">Run for Office</PrimaryButton>
            </Link>
          </div>
          <div className="col-span-12 md:col-span-4">
            <Link href="/">
              <PrimaryButton className="mt-8">Learn More</PrimaryButton>
            </Link>
          </div>
        </div>
      </div>
    </MaxWidth>
  );
}
