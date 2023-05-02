import { MdOutlineFileDownload } from 'react-icons/md';
const cards = [
  {
    title: 'Endorsement Checklist',
    description:
      'Comprehensive checklist ensuring thorough assessment of political endorsements and candidate support.',
    link: 'https://docs.google.com/document/d/1NeREKkd2HfFcrllQbAryy5Cn5FBabtfNsxI-ircv_b4/edit?usp=sharing',
  },
  {
    title: 'Sample Endorsement Pitch',
    description:
      'Example of a persuasive, well-structured pitch for securing endorsements in various contexts',
    link: 'https://docs.google.com/document/d/1Zx_WbrjQogr8ftar2PInxfXuYPvhMFBLwxZ8TTHvc3Y/edit?usp=sharing',
  },
  {
    title: 'Sample Asks of Endorsers',
    description:
      'Examples of requests and expectations for endorsers in political, business, or social contexts.',
    link: 'https://docs.google.com/document/d/1z0K6n5jhxtrYc-TpXnZBUgGGHrwEhrq68ZS1OqEX-54/edit?usp=sharing',
  },
  {
    title: 'Volunteer Checklist',
    description:
      'Essential tasks and reminders for effective volunteer engagement and orientation in organizations.',
    link: 'https://docs.google.com/document/d/16xDjKGHKH8vR80ZELw9QSyW-utu9y6ZFqQa13IAWllU/edit?usp=sharing',
  },
  {
    title: 'Sample Volunteer Sign Up Form',
    description:
      'A useful tool for campaigns to efficiently and effectively collect information from potential volunteers.',
    link: 'https://docs.google.com/document/d/11yUOHQC8KP2O00dx06oJOrPQZ39C2-WWoxhIDaEiJP4/edit?usp=sharing',
  },
  {
    title: 'Sample Volunteer Manual',
    description:
      'Comprehensive guide for volunteers, detailing roles, expectations, and best practices in various organizations.',
    link: 'https://docs.google.com/document/d/1eQ04zEURkCg8retajR03hn8CQSetTfE-rZZKz8u-hYg/edit?usp=sharing',
  },
];
export default function Resources() {
  return (
    <div>
      <div className="font-black text-2xl mb-4 mt-16">RESOURCES</div>
      <div className="p-7 bg-white rounded-2xl grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5  gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="p-6 bg-black text-white rounded-lg flex flex-col justify-between"
          >
            <div>
              <h4 className="font-black text-xl">{card.title}</h4>
              <div className="text-sm my-4">{card.description}</div>
            </div>
            <div>
              <div className="items-center bg-gp-yellow text-black  py-2 px-4 rounded-md inline-flex">
                <a
                  href={card.link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-xs font-black tracking-widest mr-2"
                >
                  DOWNLOAD
                </a>
                <MdOutlineFileDownload />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
