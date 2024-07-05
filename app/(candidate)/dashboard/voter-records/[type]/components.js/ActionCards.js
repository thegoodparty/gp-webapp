import ActionCard from './ActionCard';

const cards = [
  {
    key: 'script',
    title: 'Create a script',
    category: 'Tools',
    description:
      "Use GoodParty.org's content builder to write a phone banking script. When you are done, you can attach that script to this campaign.",
    cta: 'Write Script',
  },
  {
    key: 'schedule',
    title: 'Schedule a campaign',
    category: 'Resources',
    description:
      'Connect with our Politics team to schedule a phone banking campaign. Attach your script and pay just $.04 per outbound call. Automatically leave voicemails for one and a half cents.',
    cta: 'Schedule Today',
  },
  {
    key: 'read',
    title: 'Read more on our blog',
    category: 'Learning',
    description:
      'Want to learn more about phone banking? GoodParty.org has a collection of curated content just for you.',
    cta: 'Read More',
    link: '#',
  },
];

function readMoreLink(type) {
  if (type === 'sms') {
    return '/blog/tag/smsmms-messaging';
  }
  return '#';
}

export default function ActionCards(props) {
  const { type } = props;
  if (type.startsWith('custom-')) return null;
  const readLink = readMoreLink(type);
  cards[2].link = readLink;
  return (
    <div className="mt-4 grid grid-cols-12 gap-4">
      {cards.map((card) => (
        <div className="col-span-12 md:col-span-4 h-full" key={card.key}>
          <ActionCard {...props} card={card} />
        </div>
      ))}
    </div>
  );
}
