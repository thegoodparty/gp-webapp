import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';
import { FaBullhorn } from 'react-icons/fa';
import { RiDoorOpenLine, RiPhoneLine } from 'react-icons/ri';
import TrackerCard from './TrackerCard';

export default function ThisWeekSection(props) {
  const [showModal, setShowModal] = useState(false);
  const { contactGoals, weeksUntil, reportedVoterGoals } = props;
  const { doorKnocking, calls, digital } = reportedVoterGoals;
  const { weeks, days } = weeksUntil;
  const accumulatedTotal = calculateAccumulated(weeks, contactGoals);
  console.log('accumulatedTotal', accumulatedTotal);
  const cards = [
    {
      key: 'doorsKnocked',
      title: 'Doors knocked',
      progress: doorKnocking,
      total: accumulatedTotal.doorKnocking,
      icon: <RiDoorOpenLine />,
    },
    {
      key: 'callsMade',
      title: 'Calls made',
      progress: calls,
      total: accumulatedTotal.calls,
      icon: <RiPhoneLine />,
    },
    {
      key: 'onlineImpressions',
      title: 'Online impressions',
      progress: digital,
      total: accumulatedTotal.digital,
      icon: <FaBullhorn />,
    },
  ];
  return (
    <section>
      <div className="flex items-center mt-5 mb-3">
        <H3>This week</H3>
        <Body2 className="ml-3">May 15-21, 2023</Body2>
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

function calculateAccumulated(weeks, contactGoals) {
  let accumulatedTotal = {
    doorKnocking: 0,
    calls: 0,
    digital: 0,
  };
  if (weeks > 12) {
    return contactGoals.week12;
  }
  for (let i = 0; i < 13 - weeks; i++) {
    const key = `week${12 - i}`;
    accumulatedTotal.doorKnocking += contactGoals[key].doorKnocking;
    accumulatedTotal.calls += contactGoals[key].calls;
    accumulatedTotal.digital += contactGoals[key].digital;
  }

  return accumulatedTotal;
}
