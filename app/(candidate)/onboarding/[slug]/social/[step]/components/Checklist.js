import OnboardingWrapper from 'app/(candidate)/onboarding/shared/OnboardingWrapper';
import { Fragment } from 'react';

export default function Checklist({ inputFields, ...props }) {
  return (
    <OnboardingWrapper {...props}>
      {' '}
      Taylor, I added the content in the socialFields, so we can reuse this
      component if needed
      <div className="mt-3">
        {inputFields.map((field) => (
          <Fragment key={field.title}>
            <div className="font-bold mb-3">{field.title}</div>
            <div>{field.content}</div>
          </Fragment>
        ))}
      </div>
    </OnboardingWrapper>
  );
}
