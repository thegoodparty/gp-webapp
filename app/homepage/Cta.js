'use client';
import MaxWidth from '@shared/layouts/MaxWidth';
import Pill from '@shared/buttons/Pill';

export default function Cta({ demoCallback }) {
  return (
    <MaxWidth>
      <div className="flex items-center text-center flex-col w-full pb-20 pt-12">
        <h3 className="font-semibold text-4xl mb-12">
          Any questions? Schedule a demo with our team
        </h3>
        <div>
          <div onClick={demoCallback} id="prefooter_demo">
            <Pill outlined className="w-48">
              <div className="tracking-wide">GET A DEMO</div>
            </Pill>
          </div>
        </div>
      </div>
    </MaxWidth>
  );
}
