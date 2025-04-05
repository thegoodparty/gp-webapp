import Image from 'next/image'
import MaxWidth from '@shared/layouts/MaxWidth'
import Link from 'next/link'
import terryImg from 'public/images/run-for-office/terry.png'
import certifiedImg from 'public/images/run-for-office/certified.png'
import martyImg from 'public/images/run-for-office/marty.png'

const graduates = [
  {
    name: "Marty Grohman's Independent win in Maine",
    desc: "Independent candidate Marty Grohman was elected as Biddeford, Maine's newest mayor in November 2023. Now, Grohman is serving his community and sharing his insight.",
    img: martyImg,
    link: '/blog/article/case-study-marty-grohman',
    cta: 'Read more about Marty Grohman',
  },
  {
    name: '10 GoodParty.org certified candidates win in 2023',
    desc: 'In the November 7, 2023 off-year elections, 10 GoodParty.org Certified candidates won local elections in North Carolina, Maine, Virginia and Washington.',
    img: certifiedImg,
    link: '/blog/article/10-good-party-candidates-won-11-7-23',
    cta: 'Read more about winners',
  },
  {
    name: 'GoodParty.org helps Terry Vo to City Council win',
    desc: "Learn how Terry Vo became the first GoodParty.org Certified candidate to win her election with the help of GoodParty.org's free tools and grassroots volunteer network.",
    img: terryImg,
    link: '/blog/article/case-study-terry-vo-win',
    cta: 'Read more about Terry Vo',
  },
]

export default function Graduates() {
  return (
    <section className="pb-12">
      <MaxWidth>
        <div className="grid grid-cols-12 gap-6 md:gap-12">
          {graduates.map((graduate) => (
            <div
              key={graduate.name}
              className="col-span-12 md:col-span-4 h-full flex flex-col justify-between"
            >
              <div>
                <Image
                  src={graduate.img}
                  alt={graduate.name}
                  width={400}
                  height={400}
                  className="rounded-2xl w-full h-auto"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="text-2xl font-medium mt-5 mb-3">
                  {graduate.name}
                </div>
                <div className="text-indigo-600">{graduate.desc}</div>
              </div>
              <Link
                href={graduate.link}
                className="mt-4 text-purple-500 font-bold"
              >
                {graduate.cta}
              </Link>
            </div>
          ))}
        </div>
      </MaxWidth>
    </section>
  )
}
