import { Suspense } from 'react';
import MaxWidth from '@shared/layouts/MaxWidth';
import HubSpotForm from './components/HubSpotForm';

export default function Page() {
  return (
    <MaxWidth>
      <div className="xl:max-w-5xl  mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 mb-12">
          <div>
            <h1 className="text-5xl font-black  mb-8">
              Have questions or want to get involved?
              <br />
              <br />
              Contact us.
            </h1>
            <div className="text-xl font-bold italic">
              We&apos;ll do our best to get back to you within 24 hours.
            </div>
          </div>
          <div>
            <Suspense fallback="loading...">
              <HubSpotForm />
            </Suspense>
          </div>
        </div>
      </div>
    </MaxWidth>
  );
}
