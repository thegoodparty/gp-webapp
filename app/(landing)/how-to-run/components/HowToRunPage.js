import MaxWidth from '@shared/layouts/MaxWidth';
import H1 from '@shared/typography/H1';
import { states } from 'helpers/statesHelper';
import Link from 'next/link';

export default function HowToRunPage() {
  return (
    <div className="min-h-[calc(100vh-56px)]">
      <MaxWidth>
        <H1 className="pt-12">How to Run main landing page</H1>
        <div className="flex items-center flex-wrap mt-12 text-xl">
          {states.map((state) => (
            <div key={state.abbreviation} className="mr-4 pb-4">
              <Link href={`/how-to-run/${state.abbreviation.toLowerCase()}`}>
                {state.name}
              </Link>
            </div>
          ))}
        </div>
      </MaxWidth>
    </div>
  );
}
