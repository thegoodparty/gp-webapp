import MarketingH2 from '@shared/typography/MarketingH2'
import Image, { StaticImageData } from 'next/image'

import VictoriaImg from 'public/images/landing-pages/victoria.png'
import TerryImg from 'public/images/landing-pages/terry-c.png'
import CarlosImg from 'public/images/landing-pages/carlos.png'
import Body1 from '@shared/typography/Body1'
import { BiSolidQuoteAltRight } from 'react-icons/bi'
import WarningButton from '@shared/buttons/WarningButton'
import Link from 'next/link'
import Body2 from '@shared/typography/Body2'

interface Graduate {
  name: string
  img: StaticImageData
  desc: string
  run: string
}

const graduates: Graduate[] = [
  {
    name: 'Victoria - School Teacher, NC',
    img: VictoriaImg,
    desc: 'Either we can complain about it, or we can do something about it. Toward the beginning of this year, I decided to get off the sidelines and make a decision to run for office.',
    run: 'Ran for Town Commissioner',
  },
  {
    name: 'Terry C., Irvine, CA',
    img: TerryImg,
    desc: "It's nice to have people with experience in the space helping me get my feet under me. The truth is, I'm jumping into a race that, as an independent, is very difficult to win.",
    run: "Running for U.S. House of Representatives to represent California's 47th District",
  },
  {
    name: 'Carlos - Regulatory Writer, TN',
    img: CarlosImg,
    desc: 'As you go through life and get older and realize the people in charge are not doing a great job… then you start to question, Okay well, why not me then?',
    run: 'Ran for Metro Council Election',
  },
]

interface LearnToRunProps {
  stateName: string
}

const LearnToRun = ({ stateName }: LearnToRunProps): React.JSX.Element => {
  return (
    <div className="relative pt-20 md:pt-48">
      <div className="absolute bg-primary-dark top-0 h-1/2 w-full left-0"></div>
      <div className="max-w-screen-xl mx-auto relative z-10">
        <section
          className="
            px-4
            py-10
            md:p-20
            md:rounded-xl
            relative
            bg-indigo-50
            shadow-[0_3px_10px_rgb(0,0,0,0.2)]
          "
        >
          <div className="relative z-10">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-6">
                <Image
                  src="/images/logo/heart.svg"
                  alt="GoodParty"
                  width={200}
                  height={200}
                />
                <MarketingH2 className="my-10 md:pr-8">
                  Learn how to run for office in {stateName}
                </MarketingH2>
                <Body1>
                  GoodParty.org Academy is your crash course for learning what
                  it takes to run for office, from getting out the vote to
                  navigating the world of campaign finance.
                </Body1>
                <Link
                  href="/academy"
                  className="mt-10 block"
                  id="signup-for-academy"
                >
                  <WarningButton>
                    Sign up for GoodParty.org Academy
                  </WarningButton>
                </Link>
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className="relative md:-mt-40">
                  {graduates.map((graduate) => (
                    <div
                      key={graduate.name}
                      className="
                        px-6
                        py-5
                        shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]
                        bg-white
                        rounded-xl
                        mb-7
                        grid
                        grid-cols-12
                        gap-4
                      "
                    >
                      <div className="col-span-3 relative">
                        <Image
                          src={graduate.img}
                          alt={graduate.name}
                          className=" object-contain object-top rounded-full"
                        />
                      </div>
                      <div className=" col-span-9">
                        <Body1 className="">{graduate.desc}</Body1>
                      </div>
                      <div className="col-span-3"></div>
                      <div className="col-span-6">
                        <div className="font-bold text-purple-400">
                          {graduate.name}
                        </div>
                        <Body2 className="text-purple-400 mt-2">
                          {graduate.run}
                        </Body2>
                      </div>
                      <div className="col-span-3 flex justify-end">
                        <div className=" text-purple-400 text-6xl ">
                          <BiSolidQuoteAltRight />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute w-full left-0 h-2/3 top-0">
            <Image
              src="/images/landing-pages/spot-bg.svg"
              fill
              alt="bg"
              className="object-cover md:object-contain object-right-top"
            />
          </div>
        </section>
      </div>
    </div>
  )
}

export default LearnToRun
