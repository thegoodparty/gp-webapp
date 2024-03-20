import H2 from '@shared/typography/H2';
import Body2 from '@shared/typography/Body2';
import Body1 from '@shared/typography/Body1';
import { MdOutlineInfo } from 'react-icons/md';
import RoutePreview from './RoutePreview';

export default function RoutesSection(props) {
  const { dkCampaign, routes } = props;
  const { name } = dkCampaign;

  return (
    <div className="bg-white border border-slate-300 p-3 md:py-6 md:px-8 rounded-xl mt-6">
      <div className="flex justify-between items-start">
        <div>
          <H2>{name} Routes</H2>
          <Body2 className="mt-2">Optimized routes for your campaign.</Body2>
        </div>
        <div>dropdown</div>
      </div>
      <div className="my-6 bg-[#E5F6FD] rounded-lg px-4 py-2 flex">
        <div className="mr-3 text-cyan-700 mt-1">
          <MdOutlineInfo />
        </div>
        <div>
          <Body1 className="font-semibold text-cyan-900">
            We generate 10 routes at a time.
          </Body1>
          <Body2 className="text-cyan-900 mt-1">
            Good Party purchases route data so you don&apos;t have to. Route
            information is provided in increments to limit our upfront spending.
          </Body2>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 mt-12">
        {routes.map((route) => (
          <div
            key={route.id}
            className=" col-span-12 md:col-span-6 lg:col-span-4"
          >
            <RoutePreview route={route} />
          </div>
        ))}
      </div>
    </div>
  );
}
