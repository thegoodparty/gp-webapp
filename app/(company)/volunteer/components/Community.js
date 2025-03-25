import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';
import salImg from 'public/images/landing-pages/sal-davis.png';
import victoriaImg from 'public/images/landing-pages/victoria2.png';
import kierynImg from 'public/images/landing-pages/kieryn.png';

const people = [
  {
    title: 'Community superstar',
    name: 'Sal Davis',
    desc: "Sal Davis, from Atlanta, stands out in GoodParty.org's Community as a founding member who actively recruits other to the community and meaningfully contributes to group discussions. Previously skeptical of politics, she leverages GoodParty.org's community to take positive civic actions, embodying the community's hopeful spirit and commitment to democracy reform.",
    image: salImg,
  },
  {
    title: 'Victory showcase',
    name: 'Terry Vo',
    desc: "Terry won Nashville's three way District 17 Metro Council race with 53.78% votes, backed by GoodParty.org's resources and volunteers. An advocate for community-driven change, Vo stresses the need for diverse leadership: \"If you don't see yourself leading, take that seat.\"",
    image: victoriaImg,
  },
  {
    title: 'Volunteer Highlight:',
    name: 'Kieryn McCann',
    desc: "From McPherson, Kansas, Kieryn significantly impacted over 313 Nashville voters through phone, text, and social media outreach. Inspired by finding GoodParty.org on TikTok, Kieran is now running for office, exemplifying GoodParty.org's civic values.",
    image: kierynImg,
  },
];

export default function Community() {
  return (
    <section className="bg-indigo-50">
      <MaxWidth>
        <h2 className="text-4xl font-semibold text-center pb-10">
          Community highlights
        </h2>
        <div className="grid grid-cols-12 gap-8">
          {people.map((person) => (
            <div key={person.name} className=" col-span-12 md:col-span-4">
              <div className="md:px-4">
                <Image
                  src={person.image}
                  alt={person.name}
                  className="rounded-lg"
                />
                <h4 className="mt-5 text-2xl font-medium mb-5">
                  {person.title}:<br />
                  {person.name}
                </h4>
                <div className="font-sfpro leading-relaxed">{person.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </MaxWidth>
      <div className="bg-[linear-gradient(176deg,_rgba(0,0,0,0)_54.5%,_#0D1528_55%)] h-[calc(100vw*0.09)] w-full" />
    </section>
  );
}
