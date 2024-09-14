import MaxWidth from '@shared/layouts/MaxWidth';
import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import MarketingH1 from '@shared/typography/MarketingH1';
import MarketingH4 from '@shared/typography/MarketingH4';
import { numberFormatter } from 'helpers/numberHelper';
import Image from 'next/image';

export default function Hero({ count = 0 }) {
  return (
    <div className="bg-primary-dark py-8 lg:py-24 text-white text-center ">
      <MaxWidth>
        <MarketingH1 className="justify-center items-center">
          <div className="flex  justify-center">
            {count === 0 ? '' : numberFormatter(count)}{' '}
            <Image
              src="/images/heart.svg"
              width={80}
              height={80}
              alt="gp.org"
              className="mx-3"
              priority
            />{' '}
            Independent
          </div>
          Civic Heroes Running in the U.S.
        </MarketingH1>
        <MarketingH4 className="mt-8">
          Learn where Independent, People-Powered, and Anti-Corruption
          candidates are running and winning nationwide
        </MarketingH4>
      </MaxWidth>
    </div>
  );
}
