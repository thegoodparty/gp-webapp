'use client'

import React from 'react'
import Slider from 'react-slick'
import Image from 'next/image'
import './slick.min.css'
import './slick-theme.min.css'

interface CarouselSection {
  name: string
  description: string
  title: string
  subtitle: string
  img: string
}

interface CarouselProps {
  sections: CarouselSection[]
}

export default function Carousel({ sections }: CarouselProps): React.JSX.Element {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  }

  return (
    <div className="m-0 w-[90vw] max-w-screen-xl h-[425px] md:h-[350px] lg:[300px] bg-primary-dark-dark rounded-2xl text-white">
      <Slider {...settings}>
        {sections.map((section) => (
          <div key={section.name}>
            <div className="flex h-[425px] md:h-[350px] lg:[300px] w-full">
              <div className="flex flex-col justify-center items-center text-start w-[60%]">
                <h3 className="text-[15px] md:text-[24px] lg:text-[28px] leading-6 lg:leading-10 font-semibold text-slate-100 pr-5 pl-5">
                  {section.description}
                </h3>

                <p className="mt-3 text-[15px] md:text-[24px] lg:text-[28px] leading-6 lg:leading-10 font-normal text-slate-300 text-end w-full pr-5 md:pr-20">
                  - {section.name}
                </p>
                <p className="text-[12px] md:text-[20px] lg:text-[24px] leading-6 lg:leading-10 font-normal text-slate-200 text-end w-full pr-5 md:pr-20">
                  {section.title}
                </p>
                <p className="text-[12px] md:text-[20px] lg:text-[24px] leading-6 lg:leading-10 font-normal text-slate-200 pb-2 text-end w-full pr-5 md:pr-20">
                  {section.subtitle}
                </p>
              </div>
              <div className="flex flex-col justify-center items-center text-center w-[40%] rounded-2xl h-full relative">
                <Image
                  src={section.img}
                  fill
                  sizes="100vw"
                  className="object-cover rounded-2xl"
                  alt={section.name}
                />
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}

