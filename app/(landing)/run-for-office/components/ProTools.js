import MaxWidth from '@shared/layouts/MaxWidth';
import { FaSearchLocation } from 'react-icons/fa';
import { BsArrowUpRightCircleFill, BsMegaphone } from 'react-icons/bs';
import { AiOutlineFlag } from 'react-icons/ai';
import Link from 'next/link';
import { slugify } from 'helpers/articleHelper';

const cards = [
  {
    icon: <FaSearchLocation size={30} />,
    title: 'Voter data',
    content:
      'Get access to the intel you need about your constituents at a fraction of the cost.',
  },
  {
    icon: <BsMegaphone size={30} />,
    title: 'Texting tools',
    content:
      'Run SMS text banking programs at our wholesale cost with our network of volunteers.',
  },
  {
    icon: <AiOutlineFlag size={30} />,
    title: 'Expert support',
    content:
      'Dedicated support from our team of experts as thought partners on your campaign.',
  },
];

export default function ProTools() {
  return (
    <section className="relative">
      <div className="relative z-10">
        <MaxWidth smallFull>
          <div className="bg-white py-14 px-4 lg:p-14 lg:rounded-2xl">
            <h2 className="text-3xl lg:text-6xl font-semibold ">Pro tools</h2>
            <h3 className="text-xl lg:text-2xl font-semibold mt-10 mb-5">
              In addition to our free tools, for just $10/month...
            </h3>
            <div className="grid grid-cols-12 gap-4">
              {cards.map((card, index) => (
                <div
                  key={card.title}
                  className="col-span-12 lg:col-span-4 shadow-md p-8 rounded-xl bg-gradient-to-b from-[#FFF] to-[#F5FBCD]"
                >
                  <div className="bg-lime inline-flex rounded w-20 h-20 justify-center items-center">
                    {card.icon}
                  </div>
                  <h4 className="text-2xl lg:text-3xl font-semibold mt-5">
                    {card.title}
                  </h4>
                  <div className="text-lg mt-3 mb-10">{card.content}</div>
                  <Link
                    href="/login"
                    id={`started-card-${slugify(card.title, true)}`}
                    className="flex items-center"
                  >
                    <BsArrowUpRightCircleFill size={30} />{' '}
                    <div className="ml-2">Get Started</div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </MaxWidth>
      </div>
      <div className="absolute h-1/2 w-full bg-primary bottom-0 left-0 hidden lg:block"></div>
    </section>
  );
}
