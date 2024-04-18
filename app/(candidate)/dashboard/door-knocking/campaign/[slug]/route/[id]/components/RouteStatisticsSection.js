import Body2 from '@shared/typography/Body2';
import H2 from '@shared/typography/H2';
import Paper from '@shared/utils/Paper';
import RoutePreview from '../../../components/RoutePreview';
import StatisticsCard from 'app/(candidate)/dashboard/door-knocking/shared/StatisticsCard';
import hourglassImg from 'public/images/door-knocking/hourglass.png';
import Image from 'next/image';
import H3 from '@shared/typography/H3';
import Body1 from '@shared/typography/Body1';
import ClaimButton from 'app/(volunteer)/volunteer-dashboard/door-knocking/[dkslug]/route/[id]/components/ClaimButton';

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

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className=" col-span-12  md:col-span-4  xl:col-span-3 h-full">
        <Paper style={{ padding: '16px', height: '100%' }}>
          <RoutePreview route={route} dkCampaign={dkCampaign} noCard />
          <div>
            <ClaimButton route={route} />
          </div>
        </Paper>
      </div>
      <div className=" col-span-12 md:col-span-8 xl:col-span-9">
        <Paper style={{ height: '100%' }}>
          <H2>{summary} Route Statistics</H2>
          <Body2 className="mb-8">
            Use this data to help track your route progress.
          </Body2>
          <div className="grid grid-cols-12 gap-4">
            {knockedDoors === 0 ? (
              <div className="col-span-12 h-full flex flex-col items-center justify-center">
                <Image
                  src={hourglassImg}
                  alt="hourglass"
                  width={80}
                  height={80}
                />
                <H3 className="mt-8 text-center mb-2">Waiting for data.</H3>
                <Body1>
                  Start your door knocking campaign to begin tracking your
                  progress.
                </Body1>
              </div>
            ) : (
              <>
                {cards.map((card) => (
                  <div className=" col-span-12 md:col-span-6" key={card.label}>
                    <StatisticsCard {...card} />
                  </div>
                ))}
              </>
            )}
          </div>
        </Paper>
      </div>
    </div>
  );
}
