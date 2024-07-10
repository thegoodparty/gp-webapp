import ReadMoreCard from './ReadMoreCard';
import ScheduleCard from './ScheduleCard';
import ScriptCard from './ScriptCard';

function cardsByType(type, props) {
  let cards = [];
  if (type === 'sms' || type === 'telemarketing') {
    cards = [
      <ScriptCard {...props} key="card1" />,
      <ScheduleCard {...props} key="card2" />,
      <ReadMoreCard {...props} key="card3" />,
    ];
  }
  if (type === 'directmail' || type === 'doorknocking') {
    cards = [
      <ScriptCard {...props} key="card1" />,
      <ReadMoreCard {...props} key="card3" />,
    ];
  }
  return cards;
}

function vendorsByType(type) {
  let vendors;
  if (type === 'directmail') {
    vendors = [
      {
        logo: '/images/voterfile/mailing-logo.svg',
        name: 'Mailing.com',
        url: 'https://www.mailing.com/',
        subTitle: 'Turnkey Direct Mail Services at Scale',
        description:
          'Seamlessly execute your direct mail marketing campaigns and create exceptional print-based brand experiences.',
      },
      {
        logo: '/images/voterfile/speakeasy-logo.svg',
        name: 'SpeakEasy Political',
        url: 'https://www.speakeasypolitical.com/',
        subTitle: 'High-Impact Direct Mail Campaigns',
        description:
          'Our political direct mail templates are field tested and professionally designed to have a profound impact on voters, and propel your campaign to victory.',
      },
    ];
  }
}

export default function ActionCards(props) {
  const { type } = props;
  if (type.startsWith('custom-')) return null;

  const cards = cardsByType(type, props);
  const vendors = vendorsByType(type);

  return (
    <div className="mt-4 grid grid-cols-12 gap-4">
      {cards.map((card, index) => (
        <div
          className={`col-span-12  h-full ${
            cards.length === 3 ? 'md:col-span-4' : 'md:col-span-6'
          }`}
          key={index}
        >
          {card}
        </div>
      ))}
    </div>
  );
}
