import Body2 from '@shared/typography/Body2';
import H2 from '@shared/typography/H2';
import H3 from '@shared/typography/H3';
import Overline from '@shared/typography/Overline';
import Paper from '@shared/utils/Paper';
import { FaCirclePlay } from 'react-icons/fa6';
import { IoArrowForward } from 'react-icons/io5';

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
  },
];

export default function LearnAction(props) {
  return (
    <Paper className="mt-4">
      <H2>Learn &amp; Take Action</H2>
      <Body2 className="mt-1 mb-4 text-gray-600">
        Review the content below to get the most out of this voter file
      </Body2>
      <div className=" bg-neutral-background border border-slate-300 h-[420px] rounded-2xl flex justify-center items-center">
        <FaCirclePlay size={120} className="text-neutral" />
      </div>
      <div className="mt-4 grid grid-cols-12 gap-4">
        {cards.map((card) => (
          <div className="col-span-12 md:col-span-4 h-full" key={card.key}>
            <Paper className="h-full flex flex-col justify-between cursor-pointer">
              <div>
                <H3>{card.title}</H3>
                <Overline className="text-gray-600 mb-4">
                  {card.category}
                </Overline>
                <Body2>{card.description}</Body2>
              </div>
              <div className="mt-4 flex items-center justify-end">
                <div className="mr-2">{card.cta}</div>
                <IoArrowForward />
              </div>
            </Paper>
          </div>
        ))}
      </div>
    </Paper>
  );
}
