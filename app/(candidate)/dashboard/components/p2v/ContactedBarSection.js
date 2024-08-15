import Body1 from '@shared/typography/Body1';
import H2 from '@shared/typography/H2';
import MarketingH2 from '@shared/typography/MarketingH2';
import { AlertBanner } from '../AlertBanner';
import { MdChevronRight, MdInfo } from 'react-icons/md';
import { numberFormatter } from 'helpers/numberHelper';
import { BsInfoCircle } from 'react-icons/bs';
import { AnimatedBar } from './AnimatedBar';

export function ContactedBarSection(props) {
  const needed = 13125;
  const contacted = 5000;
  const percent = (contacted / needed) * 100;
  let bgColor = 'bg-black';
  let textColor = 'text-black';
  let severity = 'info';
  if (contacted > 0) {
    bgColor = 'bg-error-main';
    textColor = 'text-error-main';
    severity = 'error';
  }
  if (percent > 20) {
    bgColor = 'bg-warning-main';
    textColor = 'text-warning-main';
    severity = 'warning';
  }
  if (percent > 75) {
    bgColor = 'bg-success-main';
    textColor = 'text-success-main';
    severity = 'success';
  }

  return (
    <div className="p-4 border border-slate-300 rounded-lg mt-4 md:mt-0">
      <div className="md:flex justify-between">
        <div className="md:flex items-baseline mb-4 ">
          <MarketingH2 className={`${textColor} text-center md:text-left`}>
            {Math.floor(percent)}%
          </MarketingH2>
          <H2 className="ml-2 text-center md:text-left">of voters contacted</H2>
        </div>
        {percent > 0 && (
          <div className="md:pl-2">
            <AlertBanner
              message="Contact more voters to increase your chances of winning."
              severity={severity}
            />
          </div>
        )}
      </div>
      <Body1 className="text-center md:text-left">
        <strong>Current:</strong> {numberFormatter(contacted)} voters
      </Body1>
      <AnimatedBar contacted={contacted} needed={needed} bgColor={bgColor} />
      <div className="mt-2 flex justify-center md:justify-end items-center">
        <Body1>
          <strong>Needed:</strong> {numberFormatter(needed)} voter contact
        </Body1>
        <BsInfoCircle className="ml-2" />
      </div>
    </div>
  );
}
