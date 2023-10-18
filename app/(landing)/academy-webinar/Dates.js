import PrimaryButton from '@shared/buttons/PrimaryButton';
import MaxWidth from '@shared/layouts/MaxWidth';
import Body1 from '@shared/typography/Body1';
import MarketingH2 from '@shared/typography/MarketingH2';
import Image from 'next/image';
import CTA from './components/CTA';

const dates = [
  'Wednesday, October 25th, 2023 @ 7pm EST',
  'Saturday, October 28th, 2023 @ 4pm EST ',
  'Wednesday, November 1st, 2023 @ 7pm EST',
  'Friday, November 3rd, 2023 @ 3pm EST',
  'Saturday, November 4th, 2023 @ 1pm EST',
  'More dates coming soon!',
];

export default function Dates() {
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
                <CTA clickId={`dates-cta${index + 1}`}>
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
