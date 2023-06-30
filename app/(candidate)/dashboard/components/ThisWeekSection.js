import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';
import { FaBullhorn } from 'react-icons/fa';
import { RiDoorOpenLine, RiPhoneLine } from 'react-icons/ri';
import TrackerCard from './TrackerCard';
import { calculateAccumulated } from './voterGoalsHelpers';

export default function ThisWeekSection(props) {
  const { contactGoals, weeksUntil, reportedVoterGoals } = props;
  const { doorKnocking, calls, digital } = reportedVoterGoals;
  const { weeks, days } = weeksUntil;
  const accumulatedTotal = calculateAccumulated(weeks, contactGoals);
  const cards = [
    {
      key: 'doorKnocking',
      title: 'Doors knocked',
      subTitle: "doors you've knocked on",
      progress: doorKnocking,
      total: accumulatedTotal.doorKnocking,
      icon: <RiDoorOpenLine />,
    },
    {
      key: 'calls',
      title: 'Calls made',
      subTitle: "phone calls you've made",
      progress: calls,
      total: accumulatedTotal.calls,
      icon: <RiPhoneLine />,
    },
    {
      key: 'digital',
      title: 'Online impressions',
      subTitle: "online impressions you've made",
      progress: digital,
      total: accumulatedTotal.digital,
      icon: <FaBullhorn />,
    },
  ];
  return (
    <section>
      <div className="flex items-center mt-5 mb-3">
        <H3>This week</H3>
        {/* <Body2 className="ml-3">May 15-21, 2023</Body2> */}
      </div>
      <div className="grid grid-cols-12 gap-5">
        {cards.map((card) => (
          <div key={card.key} className="col-span-12 lg:col-span-4">
            <TrackerCard card={card} {...props} />
          </div>
        ))}
      </div>
    </section>
  );
}
