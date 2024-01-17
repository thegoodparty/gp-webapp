import Stepper from './Stepper';

export default function OnboardingLayout(props) {
  const { children, step } = props;
  return (
    <div className="min-h-[calc(100vh-60px)]">
      <Stepper {...props} />
      {children}
    </div>
  );
}
