import Body2 from '@shared/typography/Body2';
import H2 from '@shared/typography/H2';
import Paper from 'app/(candidate)/dashboard/door-knocking/shared/Paper';
import RoutePreview from '../../../components/RoutePreview';
import StatisticsCard from 'app/(candidate)/dashboard/door-knocking/shared/StatisticsCard';

export default function RouteStatisticsSection({ route, dkCampaign }) {
  const totalDoors = route.data?.optimizedAddresses?.length;
  const knockedDoors = 0;
  const remainingDoors = totalDoors - knockedDoors;

  const cards = [
    { label: 'Total Doors', value: totalDoors },
    { label: 'Doors Knocked', value: knockedDoors },
    { label: 'Doors Remaining', value: remainingDoors },
    { label: 'Positive Experience', value: 'n/a' },
  ];
  console.log('route', route);
  return (
    <div className="grid grid-cols-12 gap-4 mt-6">
      <div className=" col-span-12 md:col-span-9">
        <Paper style={{ height: '100%' }}>
          <H2>{route.name} Statistics</H2>
          <Body2 className="mb-8">
            Secondary copy lorem ipsum dolor sit amet, consectetur adipiscing
            elit.
          </Body2>
          <div className="grid grid-cols-12 gap-4">
            {cards.map((card) => (
              <div className=" col-span-12 md:col-span-6" key={card.label}>
                <StatisticsCard {...card} />
              </div>
            ))}
          </div>
        </Paper>
      </div>
      <div className=" col-span-12 md:col-span-3">
        <Paper style={{ padding: '16px' }}>
          <RoutePreview route={route} dkCampaign={dkCampaign} noCard />
        </Paper>
      </div>
    </div>
  );
}
