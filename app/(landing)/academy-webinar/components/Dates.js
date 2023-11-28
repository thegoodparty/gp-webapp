import PrimaryButton from '@shared/buttons/PrimaryButton';
import MaxWidth from '@shared/layouts/MaxWidth';
import Body1 from '@shared/typography/Body1';
import MarketingH2 from '@shared/typography/MarketingH2';
import Image from 'next/image';
import CTA from './CTA';

const dates = [
  'Thursday, November 30th, 2023 @ 12pm PST',
  'Tuesday, December 5th, 2023 @ 9am PST ',
  'Friday, December 8th, 2023 @ 11am PST',
  'More dates coming soon!',
];

export default function Dates({ content }) {
  return (
    <MaxWidth>
      <div className="lg:w-1/2 mt-24 mb-12">
        <MarketingH2>Session dates</MarketingH2>
      </div>
      <div className="">
        {dates.map((d, index) => (
          <div
            key={index}
            className={`flex items-center justify-between mb-3 px-4 py-3 rounded-xl ${
              index % 2 === 0 ? 'bg-blue-100' : 'bg-blue-50'
            }`}
          >
            <div>{d}</div>
            {index !== dates.length - 1 && (
              <div className="ml-3">
                <CTA clickId={`dates-cta${index + 1}`} content={content}>
                  <PrimaryButton size="medium">
                    <div className=" whitespace-nowrap">Sign up</div>
                  </PrimaryButton>
                </CTA>
              </div>
            )}
          </div>
        ))}
      </div>
    </MaxWidth>
  );
}
