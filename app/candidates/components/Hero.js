import MaxWidth from '@shared/layouts/MaxWidth';
import MarketingH1 from '@shared/typography/MarketingH1';
import MarketingH4 from '@shared/typography/MarketingH4';
import { numberFormatter } from 'helpers/numberHelper';
import Image from 'next/image';
import { memo } from 'react';

export default memo(function Hero({ count = 0, longState }) {
  return (
    <div className="bg-primary-dark py-8 lg:py-24 text-white text-center ">
      <MaxWidth>
        <MarketingH1 className="text-center">
          {numberFormatter(count)}{' '}
          <Image
            src="/images/heart.svg"
            width={80}
            height={80}
            alt="gp.org"
            className="mx-3 static inline-block w-12 h-12 lg:w-20 lg:h-20"
            priority
          />
          Independent Civic Heroes Running in{' '}
          {longState ? longState : 'the U.S'}.
        </MarketingH1>
        <MarketingH4 className="mt-8">
          Learn where Independent, People-Powered, and Anti-Corruption
          candidates are running and winning nationwide
        </MarketingH4>
      </MaxWidth>
    </div>
  );
});
