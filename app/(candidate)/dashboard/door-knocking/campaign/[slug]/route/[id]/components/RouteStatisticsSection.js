import Body2 from '@shared/typography/Body2';
import H2 from '@shared/typography/H2';
import Paper from '@shared/utils/Paper';
import RoutePreview from '../../../components/RoutePreview';
import StatisticsCard from 'app/(candidate)/dashboard/door-knocking/shared/StatisticsCard';

function formatNumber(n) {
  // Check if the number is not equal to its integer part
  if (n !== Math.floor(n)) {
    return n.toFixed(2);
  } else {
    return n;
  }
}

export default function RouteStatisticsSection({ route, dkCampaign }) {
  const totalDoors = route.data?.optimizedAddresses?.length;
  const totals = route.data?.totals;
  let knockedDoors = 0;
  let positiveExperience = 0;
  let refusalRate = 0;
  let likelyVoters = 0;
  if (totals) {
    positiveExperience = totals.positiveExperience;
    knockedDoors = totals.completed;
    if (totals.completed > 0) {
      refusalRate = (totals.refusal * 100) / totals.completed;
      likelyVoters = (totals.likelyVoters * 100) / totals.completed;
      refusalRate = formatNumber(refusalRate);
      likelyVoters = formatNumber(likelyVoters);
    }
  }

  const res = route.data?.response?.routes[0];
  const { summary } = res;

  const cards = [
    { label: 'Total Doors Knocked On', value: `${knockedDoors}/${totalDoors}` },
    { label: 'Positive Experiences', value: positiveExperience },

    { label: 'Likely Voters', value: `${likelyVoters}%` },
    { label: 'Refusal Rate', value: `${refusalRate}%` },
  ];
  console.log('route', route);
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className=" col-span-12 md:col-span-3">
        <Paper style={{ padding: '16px' }}>
          <RoutePreview route={route} dkCampaign={dkCampaign} noCard />
        </Paper>
      </div>
      <div className=" col-span-12 md:col-span-9">
        <Paper style={{ height: '100%' }}>
          <H2>{summary} Route Statistics</H2>
          <Body2 className="mb-8">
            Use this data to help track your route progress.
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
    </div>
  );
}
