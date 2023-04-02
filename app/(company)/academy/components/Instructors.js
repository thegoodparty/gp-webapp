import Image from 'next/image';

const instructors = [
  {
    name: 'Jared Alper',
    img: 'https://assets.goodparty.org/team/jared-goodparty.png',
    title: 'Politics',
    description:
      'Jared is a political strategist who has managed or served in senior strategic roles on over a dozen campaigns for US Senate, US House, state legislative and local offices across the United States. His political commentary on democoracy and election reform has been featured in: the New York Daily News, the Hill, the Fulcrum, Real Clear Politics, the Independent Voter Network, and the Wall Street Journal.',
  },
  {
    name: 'Rob Booth',
    img: 'https://assets.goodparty.org/team/rob-goodparty.png',
    title: 'Mobilization',
    description:
      'Rob has nearly 20 years of experience running winning electoral, legislative, and ballot campaigns. He has organized voters on everything from local races to presidential campaigns, helped to pioneer deep-canvassing during the marriage equality movement, and helped build the volunteer network at RepresentUs that powered the org to 171 wins in cities and states during his tome as their national field director',
  },
  {
    name: 'Colton Hess',
    img: 'https://assets.goodparty.org/team/colton-goodparty.png',
    title: 'Social Media',
    description:
      "Colton is Good Party's Head of Social and Creator Community Lead, working to mobilize an organic online movement around Good Party's ideas. Colton has years of experience using social media to politically mobilize young people. Colton founded Tok the Vote during the 2020 presidential campaign, building a coalition of creators and influencers to bring thousands of young people across the country into the political process for the first time.",
  },
];
export default function Instructors() {
  return (
    <div className="mt-28 grid grid-cols-12">
      <div className=" col-span-12 lg:col-span-8">
        <h2 className="font-black text-5xl mb-5">Our Instructors</h2>
        <p className="text-2xl mb-12">
          Good Party Academy is set to run from April 3rd to June 2nd.
          You&apos;ll be expected to join a cohort of 12 candidates and join us
          for programming 5-8 hours/week.{' '}
        </p>
      </div>
      <div className=" col-span-12">
        <div className="mt-10 grid grid-cols-12 gap-12">
          {instructors.map((inst) => (
            <div className="col-span-12 lg:col-span-4" key={inst.name}>
              <div className="relative md:h-[300px] lg:h-[400px]">
                <Image
                  src={inst.img}
                  alt={inst.name}
                  width={400}
                  height={400}
                />
              </div>
              <h3 className="text-4xl mt-12 font-black">{inst.name}</h3>
              <h4 className="text-2xl mt-1">{inst.title}</h4>
              <p className="mt-8 text-xl">{inst.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
