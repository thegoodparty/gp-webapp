import { Fragment } from 'react';

export default function Stepper(props) {
  const { step, totalSteps } = props;
  return (
    <div className="flex items-center justify-center py-8 lg:py-0 lg:fixed lg:top-5 lg:left-0 lg:w-screen lg:z-50">
      {[...Array(totalSteps)].map((e, i) => (
        <Fragment key={i}>
          <div
            className={`h-[18px] w-[18px] flex items-center justify-center rounded-full${
              step === i + 1 && ' border border-purple-400'
            } `}
          >
            <div
              className={`h-3 w-3 rounded-full ${step > i + 1 && 'bg-black'} ${
                step === i + 1 && 'bg-purple-400'
              } ${step < i + 1 && 'bg-slate-400'}`}
            ></div>
          </div>
          {i < totalSteps - 1 && (
            <div className="h-[2px] bg-slate-400 w-8  lg:w-[72px] mx-2" />
          )}
        </Fragment>
      ))}
    </div>
  );
}
