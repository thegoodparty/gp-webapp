import Body1 from '@shared/typography/Body1';
import H2 from '@shared/typography/H2';
import MarketingH2 from '@shared/typography/MarketingH2';

export function ContactedBarSection(props) {
  const needed = 13125;
  const contacted = 0;
  const percent = Math.floor((contacted / needed) * 100);
  let bgColor = 'bg-black';
  let textColor = 'text-black';
  if (percent > 1) {
    bgColor = 'bg-error-main';
    textColor = 'text-error-main';
  }
  if (percent > 20) {
    bgColor = 'bg-warning-main';
    textColor = 'text-warning-main';
  }
  if (percent > 75) {
    bgColor = 'bg-success-main';
    textColor = 'text-success-main';
  }

  return (
    <div className="p-4 border border-slate-300 rounded-lg">
      <div className="flex justify-between">
        <div className="flex items-baseline mb-4">
          <MarketingH2 className={`${textColor}`}>{percent}%</MarketingH2>
          <H2 className="ml-2">of voters contacted</H2>
        </div>
        <div>dd</div>
      </div>
      <Body1>
        <strong>Current:</strong> {contacted} voters
      </Body1>
      <div className="bg-primary h-2 rounded relative bg-opacity-10 mt-2">
        <div
          className={`${bgColor} h-2 rounded absolute top-0 left-0`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
