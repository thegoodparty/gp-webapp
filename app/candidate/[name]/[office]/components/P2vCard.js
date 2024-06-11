import Body1 from '@shared/typography/Body1';
import Body2 from '@shared/typography/Body2';
import { numberFormatter } from 'helpers/numberHelper';
import TealButton from './TealButton';
import { FaArrowRight } from 'react-icons/fa';
import CTA from './CTA';
import MarketingH4 from '@shared/typography/MarketingH4';

export default function P2vCard(props) {
  const { candidate } = props;
  const { votesNeeded, office, city, state } = candidate;
  return (
    <div className="border border-gray-700 p-6 rounded-2xl h-full">
      <MarketingH4 className="mb-8">
        Discover a clear path to victory with{' '}
        <span className="text-secondary-light">
          {numberFormatter(votesNeeded)} votes.
        </span>
      </MarketingH4>
      <div className="bg-[#222430] rounded-2xl relative w-full h-3">
        <div className="absolute left-0 top-0 w-1/3 h-full rounded-2xl  bg-gradient-to-r from-[#008080] to-[#717DE5] "></div>
      </div>
      <div className="flex justify-between mt-4">
        <Body2>
          Unlock Likely
          <br />
          Voters
        </Body2>
        <Body2 className="text-right">
          {' '}
          {numberFormatter(votesNeeded)}* Votes
          <br />
          Needed to Win
        </Body2>
      </div>
      <Body1 className="my-8">
        GoodParty.org projects that this candidate needs{' '}
        <span className="text-secondary-light">
          {numberFormatter(votesNeeded)}*
        </span>{' '}
        votes needed to win for{' '}
        <span className="text-secondary-light">{office}</span> of{' '}
        <span className="text-secondary-light">
          {city}, {state}.
        </span>
      </Body1>
      <CTA id="p2v-card-cta">
        <TealButton style={{ display: 'inline-block' }}>
          <div className="flex items-center justify-center  ">
            <div className="mr-1">Learn How</div>
            <FaArrowRight />
          </div>
        </TealButton>
      </CTA>
    </div>
  );
}
