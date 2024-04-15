import PrimaryButton from '@shared/buttons/PrimaryButton';
import WarningButton from '@shared/buttons/WarningButton';
import MaxWidth from '@shared/layouts/MaxWidth';
import Link from 'next/link';
import { IoMdCheckmark } from 'react-icons/io';

const points1 = [
  'AI Campaign Content',
  'Campaign progress tracker',
  'Path to Victory report',
  'Consultation with a campaign manager',
  'Discord community',
  'Good Party Academy',
];

const points2 = [
  'Voter data and records',
  'Dedicated support',
  'Peer-to-peer texting and calling platform',
];

export default function Pricing() {
  return (
    <section
      className="bg-primary-dark py-20 lg:py-28 text-white"
      id="pricing-section"
    >
      <MaxWidth>
        <h2 className="text-3xl lg:text-6xl font-semibold text-center">
          Affordable and accessible
        </h2>
        <h3 className="text-xl lg:px-12 font-normal mt-10 mb-5 lg:mb-16 text-center">
          Get free access to our core tools by agreeing to serve as an
          anti-corruption, independent, and people-powered representative for
          your community plus premium features for a small monthly fee.
        </h3>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-6 lg:pr-8 lg:flex lg:justify-end">
            <div className="shadow-md py-10 px-12 rounded-xl bg-[#FDFFF3] text-black">
              <h3 className=" text-3xl font-medium pb-4 mb-8 border-b border-slate-300 min-w-[300px]">
                Free
              </h3>
              {points1.map((point) => (
                <div key={point} className="flex items-center mb-4">
                  <div className="w-4 h-4 flex items-center justify-center rounded-full bg-lime-200 border border-primary mr-3">
                    <IoMdCheckmark size={12} />
                  </div>
                  <div>{point}</div>
                </div>
              ))}
              <div className="mt-14 mb-8 text-4xl font-light">$0/month</div>
              <Link id="free-candidtate" href="/login">
                <WarningButton fullWidth>Get Started</WarningButton>
              </Link>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:pl-8  lg:flex">
            <div className="shadow-md py-10 px-12 rounded-xl bg-[#E4F47D] text-black flex flex-col justify-between">
              <div>
                <h3 className=" text-3xl font-medium pb-4 mb-8 border-b border-slate-300 min-w-[300px]">
                  Pro
                </h3>
                <div className="font-bold mb-6">Everything in free plus…</div>
                {points2.map((point) => (
                  <div key={point} className="flex items-center mb-4">
                    <div className="w-4 h-4 flex items-center justify-center rounded-full bg-lime-200 border border-primary mr-3">
                      <IoMdCheckmark size={12} />
                    </div>
                    <div>{point}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="mt-14 mb-8 text-4xl font-light">$10/month</div>
                <Link id="pro-candidtate" href="/pro-consultation">
                  <PrimaryButton fullWidth>Get Started</PrimaryButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </MaxWidth>
    </section>
  );
}
