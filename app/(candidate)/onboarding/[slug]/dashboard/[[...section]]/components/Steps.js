import MaxWidth from '@shared/layouts/MaxWidth';
import Step from './Step';

export default function Steps(props) {
  const { campaignSteps, sectionIndex } = props;
  const steps =
    sectionIndex !== false ? campaignSteps[sectionIndex].steps : campaignSteps;

  return (
    <MaxWidth>
      <div className=" rounded-2xl mt-6">
        <div className="grid grid-cols-12 gap-4 items-stretch">
          {steps.map((step, index) => (
            <Step key={step.key} step={step} index={index} {...props} />
          ))}
        </div>
      </div>
    </MaxWidth>
  );
}
