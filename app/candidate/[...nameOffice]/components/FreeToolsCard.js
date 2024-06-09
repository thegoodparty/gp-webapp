import Body1 from '@shared/typography/Body1';
import TealButton from './TealButton';
import { FaArrowRight } from 'react-icons/fa';
import CTA from './CTA';
import H5 from '@shared/typography/H5';
import { FaGlobeAmericas } from 'react-icons/fa';
import MarketingH4 from '@shared/typography/MarketingH4';

const fields = [
  { label: 'SMS', icon: <FaGlobeAmericas /> },
  { label: 'Phone Banking', icon: <FaGlobeAmericas /> },
  { label: 'Website & Bio', icon: <FaGlobeAmericas /> },
  { label: 'Door Knocking', icon: <FaGlobeAmericas /> },
  { label: 'Email Blasts', icon: <FaGlobeAmericas /> },
  { label: 'Press Releases', icon: <FaGlobeAmericas /> },
];

export default function FreeToolsCard() {
  return (
    <div className="border border-gray-700 p-6 rounded-2xl">
      <MarketingH4 className="mb-3">
        Free tools and data to help you win.
      </MarketingH4>
      <Body1>
        GoodParty.org offers free AI tools to help you generate content for all
        your campaign needs.
      </Body1>

      <div className="grid grid-cols-12 gap-4 my-8">
        {fields.map((field) => (
          <div className="col-span-12 md:col-span-4" key={field.label}>
            <div className="flex items-center">
              <div className="text-secondary-light">{field.icon}</div>
              <H5 className="ml-2">{field.label}</H5>
            </div>
          </div>
        ))}
      </div>

      <CTA>
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