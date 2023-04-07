import Pill from '@shared/buttons/Pill';
import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';
import calendarImg from 'public/images/landing-pages/calendar.png';

const instructors = [
  {
    name: 'Jared Alper',
    img: 'https://assets.goodparty.org/team/jared-goodparty.jpg',
    title: 'Political Director',
    description:
      'Jared is a political strategist who has managed or served in senior strategic roles on over a dozen campaigns for US Senate, US House, state legislative and local offices across the United States. His political commentary on democoracy and election reform has been featured in: the New York Daily News, the Hill, the Fulcrum, Real Clear Politics, the Independent Voter Network, and the Wall Street Journal.',
  },
  {
    name: 'Rob Booth',
    img: 'https://assets.goodparty.org/team/rob-goodparty.png',
    title: 'IRL Mobilization & Volunteers ',
    description:
      "Rob has nearly 20 years of experience running winning electoral, legislative, and ballot campaigns. He has organized voters on everything from local races to presidential campaigns, helped to pioneer deep-canvassing during the marriage equality movement, and helped build RepresentUs' volunteer network from the ground up. He has led several successful ballot measure efforts during his time as National Field Director at RepresentUs.",
  },
  {
    name: 'Colton Hess',
    img: 'https://assets.goodparty.org/team/colton-goodparty.png',
    title: 'Social Media & Community',
    description:
      "Colton is Good Party's Head of Social and Creator Community Lead, working to mobilize an organic online movement around Good Party's ideas. Colton has years of experience using social media to politically mobilize young people. Colton founded Tok the Vote during the 2020 presidential campaign, building a coalition of creators and influencers to bring thousands of young people across the country into the political process for the first time.",
  },
];

export default function Experts() {
  return (
    <section className="my-24">
      <MaxWidth>
        <h2 className="font-black text-4xl">Talk to our experts</h2>
        <h3 className=" text-2xl mt-3 lg:w-[65%]">
          You&apos;ll learn from experienced leaders across the political
          spectrum that will teach you how to run a successful, cutting-edge
          campaign.
        </h3>

        <div className="mt-10 grid grid-cols-12 gap-12">
          {instructors.map((inst) => (
            <div className="col-span-12 lg:col-span-4" key={inst.name}>
              <div className="relative md:h-[300px] lg:h-[400px]">
                <Image
                  src={inst.img}
                  alt={inst.name}
                  width={400}
                  height={400}
                  className="rounded-full"
                />
              </div>
              <h3 className="text-4xl mt-12 font-black">{inst.name}</h3>
              <h4 className="text-2xl mt-1">{inst.title}</h4>
              <p className="mt-8 text-xl">{inst.description}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center flex-col w-full">
          <h3 className=" font-black text-4xl mt-32 mb-12">
            Any questions? Schedule a demo with our team
          </h3>
          <Image src={calendarImg} alt="Book a demo" width={732} height={542} />
          <div className="mt-12">
            <Pill outlined className="w-48">
              <div className="tracking-wide">GET A DEMO</div>
            </Pill>
          </div>
        </div>
      </MaxWidth>
    </section>
  );
}
