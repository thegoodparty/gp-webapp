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
        <MarketingH1 className="text-center !text-4xl md:!text-5xl lg:!text-6xl xl:!text-7xl">
          {numberFormatter(count)} Wins by
          <Image
            src="/images/heart.svg"
            width={80}
            height={80}
            alt="gp.org"
            className="mx-3 static inline-block w-10 h-10 md:w-14 md:h-14 lg:w-18 lg:h-18 xl:w-20 xl:h-20"
            priority
          />
          Independents across {longState ? longState : 'the U.S'}. 🎉
        </MarketingH1>
      </MaxWidth>
    </div>
  );
});
