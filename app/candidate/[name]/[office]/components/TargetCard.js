import Body1 from '@shared/typography/Body1'
import { kFormatter, numberFormatter } from 'helpers/numberHelper'
import TealButton from './TealButton'
import { FaArrowRight } from 'react-icons/fa'
import Overline from '@shared/typography/Overline'
import CTA from './CTA'
import MarketingH4 from '@shared/typography/MarketingH4'

export default function TargetCard(props) {
  const { candidate } = props
  const { p2vData } = candidate

  const { office, city, state } = candidate

  const { republicans, democrats, indies, totalRegisteredVoters } = p2vData
  let textSize = 'text-4xl'
  if (totalRegisteredVoters > 999999) {
    textSize = 'text-3xl'
  }
  return (
    <div className="border border-gray-700 p-6 rounded-2xl h-full  flex flex-col justify-between">
      <div>
        <MarketingH4 className="mb-8">
          Target all{' '}
          <span className="text-secondary-light">
            {numberFormatter(totalRegisteredVoters)} voters
          </span>{' '}
          for this race.
        </MarketingH4>
        <div className="grid grid-cols-12 gap-4 ">
          <div className="col-span-12 md:col-span-4">
            <div className={`${textSize} font-medium mb-2`}>
              {indies > 999999 ? kFormatter(indies) : numberFormatter(indies)}
            </div>
            <Overline>INDEPENDENTS</Overline>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className={`${textSize} font-medium mb-2`}>
              {republicans > 999999
                ? kFormatter(republicans)
                : numberFormatter(republicans)}
            </div>
            <Overline>REPUBLICANS</Overline>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className={`${textSize} font-medium mb-2`}>
              {democrats > 999999
                ? kFormatter(democrats)
                : numberFormatter(democrats)}
            </div>
            <Overline>DEMOCRATS</Overline>
          </div>
        </div>
        <Body1 className="my-8">
          GoodParty.org has{' '}
          <span className="text-secondary-light">
            {numberFormatter(totalRegisteredVoters)}
          </span>{' '}
          voter data and contact info for{' '}
          <span className="text-secondary-light">{office}</span> of{' '}
          <span className="text-secondary-light">
            {city}, {state}.
          </span>
        </Body1>
      </div>
      <CTA id="targe-card-cta">
        <TealButton style={{ display: 'inline-block' }}>
          <div className="flex items-center justify-center  ">
            <div className="mr-1">Get Data</div>
            <FaArrowRight />
          </div>
        </TealButton>
      </CTA>
    </div>
  )
}
