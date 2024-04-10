import Body2 from '@shared/typography/Body2';
import H2 from '@shared/typography/H2';
import CircularProgressChart from './CircularProgressChart';
import StatisticsCard from '../../../shared/StatisticsCard';
import { kFormatter } from 'helpers/numberHelper';

export default function StatisticsSection(props) {
  const { dkCampaign, routes, totals } = props;
  if (!dkCampaign) return null;
  const { name, type } = dkCampaign;

  let routesCompleted = 0;
  routes.forEach((route) => {
    if (route.status === 'completed') {
      routesCompleted += 1;
    }
  });

  const fields = [
    {
      key: 'totalKnockedOn',
      label: 'Total Doors Knocked on',
      value: kFormatter(totals?.completed),
      col: 4,
    },
    {
      key: 'routesCompleted',
      label: 'Routes Completed',
      value: routesCompleted,
      col: 4,
    },
    {
      key: 'likelyVoters',
      label: 'Likely Voters',
      value:
        totals?.completed !== 0
          ? `${(totals?.likelyVoters * 100) / totals?.completed}%`
          : 0,
      col: 4,
    },
    {
      key: 'positiveExperience',
      label: 'Positive Experience',
      value: totals?.positiveExperience || 0,
      col: 6,
    },
    {
      key: 'refusalRate',
      label: 'Refusal Rate',
      value:
        totals?.completed !== 0
          ? `${(totals.refusal * 100) / totals.completed}%`
          : 0,
      col: 6,
    },
  ];
  const housesLeft = kFormatter(totals?.totalAddresses - totals?.completed);

  return (
    <div className="bg-white border border-slate-300 p-3 md:py-6 md:px-8 rounded-xl">
      <div className="flex justify-between items-start">
        <div>
          <H2>{name} Statistics</H2>
          <Body2 className="mt-2">
            Use this data to help track your campaigns progress.
            <br />
            Campaign Type: <span className="font-semibold">{type}</span>
          </Body2>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 mt-12">
        <div className="col-span-12 lg:col-span-4 xl:col-span-3 h-full">
          <div className="bg-gray-50 border border-slate-300 rounded-xl  h-full p-8 lg:p-4 flex items-center justify-center relative">
            <CircularProgressChart
              goal={totals.totalAddresses}
              progress={totals.completed}
            />
            <div className="absolute h-full w-full flex flex-col items-center justify-center">
              <h3 className="mb-1  text-center text-4xl xl:text-5xl font-medium">
                {housesLeft}
              </h3>
              <Body2>Houses Left</Body2>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-8 xl:col-span-9">
          <div className="grid grid-cols-12 gap-3">
            {fields.map((field) => (
              <div
                key={field.key}
                className={`col-span-12 ${
                  field.col === 6 ? 'lg:col-span-6' : 'lg:col-span-4'
                }`}
              >
                <StatisticsCard {...field} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
