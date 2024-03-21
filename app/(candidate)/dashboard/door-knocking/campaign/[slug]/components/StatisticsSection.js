import { Primary } from '@shared/buttons/ErrorButton.stories';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import Body2 from '@shared/typography/Body2';
import H2 from '@shared/typography/H2';
import H3 from '@shared/typography/H3';
import { dateUsHelper } from 'helpers/dateHelper';
import CircularProgressChart from './CircularProgressChart';

export default function StatisticsSection(props) {
  const { dkCampaign, routes } = props;
  if (!dkCampaign) return null;
  const { name, endDate, startDate, type } = dkCampaign;

  let routesFinished = 0;
  let routesInProgress = 0;
  routes.forEach((route) => {
    if (route.status === 'completed') {
      routesFinished += 1;
    } else if (route.status === 'in progress') {
      routesInProgress += 1;
    }
  });

  const fields = [
    { key: 'routesFinished', label: 'Routes Finished', value: routesFinished },
    {
      key: 'routesInProgress',
      label: 'Routes In Progress',
      value: routesInProgress,
    },
    { key: 'routesTotal', label: 'Total Routes', value: routes?.length || 0 },
    // { key: 'voterCount', label: 'Total Voters', value: '100,000' },
    { key: 'knockedOn', label: 'Total Doors Knocked On', value: 500 },
    // { key: 'positiveExperience', label: 'Positive Experiences', value: '56%' },
  ];

  return (
    <div className="bg-white border border-slate-300 p-3 md:py-6 md:px-8 rounded-xl">
      <div className="flex justify-between items-start">
        <div>
          <H2>{name} Statistics</H2>
          <Body2 className="mt-2">
            Campaign Duration:{' '}
            <span className="font-semibold">
              {dateUsHelper(startDate)} - {dateUsHelper(endDate)}.
            </span>
            <br />
            Campaign Type: <span className="font-semibold">{type}</span>
          </Body2>
        </div>
        {/* <div>
          <PrimaryButton>Manage Campaign</PrimaryButton>
        </div> */}
      </div>
      <div className="grid grid-cols-12 gap-3 mt-12">
        <div className="col-span-12 lg:col-span-4 h-full">
          <div className="bg-gray-50 border border-slate-300 rounded-xl  h-full p-4 flex items-center justify-center pt-10 relative">
            <CircularProgressChart goal={100} progress={40} />
            <div className="absolute h-full w-full flex items-center justify-center">
              <H3>Progress</H3>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-12 gap-3">
            {fields.map((field) => (
              <div
                key={field.key}
                className="col-span-12 md:col-span-12 lg:col-span-6"
              >
                <div className="bg-gray-50 border border-slate-300 rounded-xl p-4">
                  <h3 className="mb-2  text-center text-4xl xl:text-5xl font-medium">
                    {field.value}
                  </h3>
                  <Body2 className="text-center">{field.label}</Body2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
