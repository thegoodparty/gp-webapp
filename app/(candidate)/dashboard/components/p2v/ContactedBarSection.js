import Body1 from '@shared/typography/Body1';
import H2 from '@shared/typography/H2';
import MarketingH2 from '@shared/typography/MarketingH2';
import { AlertBanner } from '../AlertBanner';
import { MdChevronRight } from 'react-icons/md';

export function ContactedBarSection(props) {
  const needed = 13125;
  const contacted = 50;
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
    <div className="p-4 border border-slate-300 rounded-lg">
      <div className="flex justify-between">
        <div className="flex items-baseline mb-4">
          <MarketingH2 className={`${textColor}`}>
            {Math.floor(percent)}%
          </MarketingH2>
          <H2 className="ml-2">of voters contacted</H2>
        </div>
        {percent > 0 && (
          <AlertBanner
            message="Contact more voters to increase your chances of winning."
            severity={severity}
          />
        )}
      </div>
      <Body1>
        <strong>Current:</strong> {contacted} voters
      </Body1>
      <div className="bg-primary h-2 rounded relative bg-opacity-10 mt-2">
        <div
          className={`${bgColor} h-2 rounded absolute top-0 left-0`}
          style={{ width: `${percent > 100 ? 100 : percent}%` }}
        />
      </div>
    </div>
  );
}
