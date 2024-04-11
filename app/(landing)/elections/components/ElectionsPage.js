import MaxWidth from '@shared/layouts/MaxWidth';
import H1 from '@shared/typography/H1';
import { states } from 'helpers/statesHelper';
import Link from 'next/link';
import Hero from './Hero';
import FeaturedCities from './FeaturedCities';
import LinksSection from '../shared/LinksSection';
import Tools from './Tools';
import GraduateSpotlight from 'app/(landing)/academy-webinar/components/GraduateSpotlight';
import PrimaryButton from '@shared/buttons/PrimaryButton';

export default function ElectionsPage() {
  const divisionLink = (state) => {
    return `/elections/${state.abbreviation.toLowerCase()}`;
  };
  return (
    <div className="bg-slate-50 pb-14">
      <Hero />
      <div
        className={`bg-[linear-gradient(172deg,_#F1FBA3_54.5%,_#0D1528_55%)] h-[calc(100vw*.17)] w-full`}
      />
      <FeaturedCities />
      <div className="bg-primary-dark -mt-12 pt-24 md:pt-32 md:pb-12">
        <div className="max-w-screen-xl mx-auto">
          <LinksSection
            entities={states}
            linkFunc={divisionLink}
            title="Explore elections in your state"
          />
        </div>
      </div>
      <div className="hidden md:block bg-[linear-gradient(172deg,_#0D1528_54.5%,_#F1FBA3_55%)] h-[calc(100vw*.17)] w-full" />
      <Tools />
      <div className="mt-14">
        <GraduateSpotlight
          title={
            <div className="text-center flex items-center flex-col mb-10 md:mb-14">
              <h2 className=" font-semibold text-3xl md:text-5xl">
                Real people. Real victories. Real change.
              </h2>
              <h3 className="mt-5 md:mt-8 text-xl md:text-3xl md:w-2/3">
                How real people are learning how to run for office and win with
                our free course, Good Party Academy
              </h3>
            </div>
          }
          cta={
            <Link href="/academy">
              <PrimaryButton>Learn more about Good Party Academy</PrimaryButton>
            </Link>
          }
        />
      </div>
    </div>
  );
}
