import MaxWidth from '@shared/layouts/MaxWidth'
import robImg from 'public/images/landing-pages/rob3.png'
import creativityImg from 'public/images/landing-pages/creativity.png'
import friendsImg from 'public/images/landing-pages/friends.png'
import electoralImg from 'public/images/landing-pages/electoral.png'
import starImg from 'public/images/landing-pages/star.png'
import { Fragment } from 'react'
import Image from 'next/image'
import CTA from './CTA'

const points = [
  {
    title: 'Whatever you can do!',
    subTitle: [
      "We meet you where you're at.",
      '2 minutes or many hours.',
      'Civic activism should be fun!',
    ],
    image: robImg,
  },

  {
    title: 'Help with your creativity!',
    subTitle: [
      'Make memes, info graphics or campaign images.',
      'Make music, a jingle or sound.',
      'Put your passions into making people matter more than money!',
    ],
    image: creativityImg,
  },

  {
    title: 'Connect and make friends',
    subTitle: [
      'Join a community of bright change makers.',
      'Make friends and change the world!',
    ],
    image: friendsImg,
  },

  {
    title: 'Real action = real electoral results',
    subTitle:
      'Join our Fast Action Team — a collective of dedicated volunteers harnessing the collective strength of our movement to support people-powered candidates during their most important election sprints with text banking, phone banking, and other fast forms of remote support.',
    image: electoralImg,
  },
]

export default function WhatWillDo() {
  return (
    <section className="bg-indigo-200">
      <MaxWidth>
        <h2 className="text-3xl md:text-5xl font-semibold md:text-center pt-20 md:pt-40 pb-9 md:pb-20">
          What will I do?
        </h2>
        <div className="grid grid-cols-12 gap-4 md:gap-8">
          {points.map((point, index) => (
            <Fragment key={point.title}>
              {index % 2 !== 0 && (
                <div className="hidden md:block col-span-12 md:col-span-5 mb-5">
                  <div className="w-1/2 left-1/4 relative">
                    <Image src={point.image} alt={point.title} />
                  </div>
                </div>
              )}
              <div className="col-span-12 md:col-span-7">
                <div className="md:flex items-start">
                  <Image
                    src={starImg}
                    alt={point.title}
                    height={28}
                    width={28}
                    className="mr-3 mt-1 mb-2 md:mb-0"
                  />
                  <div>
                    <h3 className="text-2xl md:text-4xl mb-2">{point.title}</h3>
                    <div className="text-lg mb-10">
                      {Array.isArray(point.subTitle) ? (
                        <ul>
                          {point.subTitle.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        point.subTitle
                      )}
                    </div>
                    <div className="hidden md:block">
                      <CTA id={`cta-${point.title}`} />
                    </div>
                  </div>
                </div>
              </div>
              {index % 2 === 0 && (
                <div className="hidden md:block col-span-12 md:col-span-5  mb-5">
                  <div className="w-1/2 left-1/4 relative">
                    <Image src={point.image} alt={point.title} />
                  </div>
                </div>
              )}
            </Fragment>
          ))}

          <div className=" md:hidden col-span-12">
            <div className="text-center mb-12">
              <CTA id={`cta-will-do-mobile`} />
            </div>
            <Image src={friendsImg} alt="friends" />
          </div>
        </div>
      </MaxWidth>
      <div className="bg-[linear-gradient(176deg,_#E0E6EC_54.5%,_#F9FAFB_55%)] h-[calc(100vw*0.09)] w-full" />
    </section>
  )
}
