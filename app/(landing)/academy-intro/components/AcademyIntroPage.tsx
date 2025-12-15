import Image from 'next/image'
import jarobImg from 'public/images/landing-pages/jarob.png'
import starImg from 'public/images/landing-pages/star.png'
import BreannaBottom from './BreannaBottom'
import { Suspense } from 'react'
import CalendarIframe from './CalendarIframe'

interface Point {
  title: string
  subTitle: string
}

const points: Point[] = [
  {
    title: 'You + GoodParty.org',
    subTitle:
      "We'll discuss your background, what you're interested in running for, and our organization's mission.",
  },
  {
    title: 'The curriculum',
    subTitle:
      'Learn how we help you combine your unique narrative and skills with a winning campaign strategy.',
  },
  {
    title: 'Next steps',
    subTitle:
      "We'll discuss available cohort start dates and lock down your spot.",
  },
]

export default function AcademyIntroPage(): React.JSX.Element {
  return (
    <div className="grid grid-cols-12 min-h-screen">
      <div className="col-span-12 md:col-span-6 bg-indigo-50 h-full flex justify-end">
        <div className="max-w-[640px] md:w-[50vw] pr-4 lg:pr-20 pl-4 xl:pl-0 pb-12">
          <h1 className="mt-16 lg:mt-24 font-semibold text-4xl ">
            Meet our team to learn about GoodParty.org Academy and secure your
            spot
          </h1>
          <Image
            src={jarobImg}
            alt="Jared and Rob"
            width={107}
            height={56}
            className="my-8"
          />
          <h2 className="font-medium text-[32px] mb-5">
            What we&apos;ll talk about
          </h2>
          <div className="px-5">
            {points.map((point) => (
              <div key={point.title} className="flex items-start mb-4">
                <Image
                  src={starImg}
                  width={26}
                  height={26}
                  alt="star"
                  className="mt-1"
                />
                <div className="pl-3">
                  <h3 className="text-2xl font-medium">{point.title}</h3>
                  <div className="font-sfpro mt-2 leading-relaxed">
                    {point.subTitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:block">
            <Suspense>
              <BreannaBottom />
            </Suspense>
          </div>
        </div>
      </div>
      <div className="col-span-12 md:col-span-6  h-full bg-[linear-gradient(142deg,_#8436F8_15.75%,_#8EAFE0_52.68%,_#90EEBF_88.1%)]">
        <div className="max-w-[640px] md:w-[50vw] pr-4 pl-4 xl:pr-0 flex items-center justify-center h-full">
          <CalendarIframe />
        </div>
      </div>
      <div className="col-span-12 md:hidden">
        <Suspense>
          <BreannaBottom />
        </Suspense>
      </div>
    </div>
  )
}
