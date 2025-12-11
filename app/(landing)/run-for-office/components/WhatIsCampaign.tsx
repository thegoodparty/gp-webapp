import MaxWidth from '@shared/layouts/MaxWidth'
import Image from 'next/image'
import RunCampaignButton from './RunCampaignButton'
import Link from 'next/link'
import WhiteButton from './WhiteButton'
import doorKnockingImg from 'public/images/run-for-office/door-knocking.png'

interface Point {
  large: string
  small: string
}

const points: Point[] = [
  { large: '300+', small: 'Candidates supported' },
  { large: '25%', small: 'Win rate in 2023' },
  { large: '50+', small: 'Years of campaign expertise' },
]

export default function WhatIsCampaign(): React.JSX.Element {
  return (
    <section className="bg-primary-dark text-white py-20">
      <MaxWidth>
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-12 lg:col-span-6">
            <h2 className="text-3xl lg:text-6xl font-semibold ">
              What is
              <Image
                src="/images/logo/heart.svg"
                width={88}
                height={72}
                alt="gp"
                className="inline-block mx-3"
              />{' '}
              AI Campaign Manager
            </h2>
            <div className="my-8 text-lg">
              Our mission is to level the playing field for non-partisan,
              independent, and third-party candidates. Our free, simple, and
              powerful AI tools help refine your strategy, find volunteers,
              create content, and more.
            </div>
            <div className="my-10 flex">
              <RunCampaignButton id="what-is-get-started" color="warning" />
              <Link href="/get-a-demo" id="what-is-demo" className="block ml-5">
                <WhiteButton label="Get a Demo" />
              </Link>
            </div>
            <div className="grid grid-cols-12 gap-4">
              {points.map((point) => (
                <div key={point.large} className="col-span-4">
                  <div className=" bg-[#2A2E33] rounded-lg py-3 px-3 lg:py-6 lg:px-5 h-full">
                    <div className="text-3xl lg:text-5xl font-bold">
                      {point.large}
                    </div>
                    <div className="text-lg text-slate-200 mt-2">
                      {point.small}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6 hidden lg:flex justify-end">
            <Image
              src={doorKnockingImg}
              alt="Door knocking app"
              width={348}
              height={703}
            />
          </div>
        </div>
      </MaxWidth>
    </section>
  )
}
