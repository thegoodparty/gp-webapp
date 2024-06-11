import Body1 from '@shared/typography/Body1';
import Body2 from '@shared/typography/Body2';
import { numberFormatter } from 'helpers/numberHelper';
import TealButton from './TealButton';
import { FaArrowRight } from 'react-icons/fa';
import Overline from '@shared/typography/Overline';
import CTA from './CTA';
import MarketingH4 from '@shared/typography/MarketingH4';

export default function TargetCard(props) {
  const { candidate } = props;
  const {
    office,
    city,
    state,
    votersCount,
    independents,
    republicans,
    democrats,
  } = candidate;
  return (
    <div className="border border-gray-700 p-6 rounded-2xl h-full">
      <MarketingH4 className="mb-8">
        Target all{' '}
        <span className="text-secondary-light">
          {numberFormatter(votersCount)} voters
        </span>{' '}
        for this race.
      </MarketingH4>
      <div className="grid grid-cols-12 gap-4 ">
        <div className="col-span-12 md:col-span-4">
          <div className=" text-4xl font-medium mb-2">
            {numberFormatter(independents)}
          </div>
          <Overline>INDEPENDENTS</Overline>
        </div>

        <div className="col-span-12 md:col-span-4">
          <div className=" text-4xl font-medium mb-2">
            {numberFormatter(republicans)}
          </div>
          <Overline>REPUBLICANS</Overline>
        </div>

        <div className="col-span-12 md:col-span-4">
          <div className=" text-4xl font-medium mb-2">
            {numberFormatter(democrats)}
          </div>
          <Overline>DEMOCRATS</Overline>
        </div>
      </div>
      <Body1 className="my-8">
        GoodParty.org has{' '}
        <span className="text-secondary-light">
          {numberFormatter(votersCount)}
        </span>{' '}
        voter records and contact info for{' '}
        <span className="text-secondary-light">{office}</span> of{' '}
        <span className="text-secondary-light">
          {city}, {state}.
        </span>
      </Body1>
      <CTA id="targe-card-cta">
        <TealButton style={{ display: 'inline-block' }}>
          <div className="flex items-center justify-center  ">
            <div className="mr-1">Get Data</div>
            <FaArrowRight />
          </div>
        </TealButton>
      </CTA>
    </div>
  );
}
