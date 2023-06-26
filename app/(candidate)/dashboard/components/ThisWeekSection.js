import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';
import { FaBullhorn } from 'react-icons/fa';
import { RiDoorOpenLine, RiPhoneLine } from 'react-icons/ri';
import TrackerCard from './TrackerCard';

export default function ThisWeekSection(props) {
  const cards = [
    {
      key: 'doorsKnocked',
      title: 'Doors knocked',
      progress: 100,
      total: 2000,
      icon: <RiDoorOpenLine />,
    },
    {
      key: 'callsMade',
      title: 'Calls made',
      progress: 200,
      total: 2000,
      icon: <RiPhoneLine />,
    },
    {
      key: 'onlineImpressions',
      title: 'Online impressions',
      progress: 300,
      total: 2000,
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
