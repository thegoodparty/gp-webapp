import MaxWidth from '@shared/layouts/MaxWidth';
import IncentiveCard from './IncentiveCard';
import Step from './Step';
// import { shortVersionStep4 } from '../campaignSteps';

export default function Steps(props) {
  const { campaignSteps, shortVersion } = props;
  let steps;
  if (shortVersion) {
    steps = campaignSteps.slice(0, 3);
    // steps[4] = shortVersionStep4;
  } else {
    steps = campaignSteps;
  }
  return (
    <MaxWidth>
      <div className=" rounded-2xl mt-6">
        <div className="grid grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {steps.map((step) => (
            <>
              {step.type === 'gap' ? (
                <div
                  className="col-span-12 lg:col-span-4 hidden lg:block"
                  key={step.key}
                ></div>
              ) : (
                <>
                  {step.type === 'incentive' ? (
                    <IncentiveCard key={step.key} step={step} {...props} />
                  ) : (
                    <Step key={step.key} step={step} {...props} />
                  )}
                </>
              )}
            </>
          ))}
        </div>
      </div>
    </MaxWidth>
  );
}
