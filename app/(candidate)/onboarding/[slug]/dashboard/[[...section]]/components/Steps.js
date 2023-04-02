import MaxWidth from '@shared/layouts/MaxWidth';
import DashboardStep from './DashboardStep';
import SectionStep from './SectionStep';

export default function Steps(props) {
  const { campaignSteps, sectionIndex } = props;
  const steps =
    sectionIndex !== false ? campaignSteps[sectionIndex].steps : campaignSteps;

  return (
    <MaxWidth>
      <div className=" rounded-2xl mt-6">
        <div className="grid grid-cols-12 gap-4 items-stretch">
          {steps.map((step, index) => (
            <>
              {sectionIndex === false ? (
                <DashboardStep
                  key={step.key}
                  step={step}
                  index={index}
                  {...props}
                />
              ) : (
                <SectionStep
                  key={step.key}
                  step={step}
                  index={index}
                  {...props}
                />
              )}
            </>
          ))}
        </div>
      </div>
    </MaxWidth>
  );
}
