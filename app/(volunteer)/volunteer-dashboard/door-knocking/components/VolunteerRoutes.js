import PrimaryButton from '@shared/buttons/PrimaryButton';
import H1 from '@shared/typography/H1';
import RoutePreview from 'app/(candidate)/dashboard/door-knocking/campaign/[slug]/components/RoutePreview';
import Link from 'next/link';
import { RxTarget } from 'react-icons/rx';

export default function VolunteerRoutes(props) {
  const { routes } = props;
  console.log('routes', routes);
  return (
    <section className="lg:hidden">
      <div className="p-2">
        <H1 className="mb-4">Routes</H1>

        {routes.map((route) => (
          <div
            key={route.id}
            className="bg-white p-4 mb-4 rounded border border-slate-300"
          >
            <RoutePreview route={route} noCard />
            <div className="bg-teal-50 text-green-700  mt-2  mb-8 p-2 rounded inline-flex items-center font-medium">
              <RxTarget />
              <div className="ml-2 text-sm">{route.type}</div>
            </div>
            <Link href={`/volunteer-dashboard/door-knocking/route/${route.id}`}>
              <PrimaryButton variant="outlined" fullWidth>
                View Route
              </PrimaryButton>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
