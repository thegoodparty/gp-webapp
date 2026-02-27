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
  img: string
}

interface CarouselProps {
  sections: CarouselSection[]
}

const Carousel = ({ sections }: CarouselProps): React.JSX.Element => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  }
  return (
    <div className="m-0 w-[450px] md:w-[700px] lg:w-[900px] h-full bg-primary-dark-dark rounded-2xl text-white">
      <Slider {...settings}>
        {sections.map((section) => (
          <div key={section.name}>
            <div className="flex h-full w-full items-stretch">
              <div className="flex flex-col justify-center items-stretch text-start w-[60%]">
                <h3 className="text-[15px] md:text-[24px] lg:text-[28px] leading-10 font-semibold text-slate-100 pr-5 pl-5 h-full">
                  {section.description}
                </h3>

                <p className="mt-3 text-[15px] md:text-[24px] lg:text-[28px] leading-10 font-normal text-slate-300 text-end w-full pr-20">
                  - {section.name}
                </p>
                <p className="text-[15px] md:text-[24px] lg:text-[28px] leading-10 font-normal text-indigo-200 pb-5 text-end w-full pr-20">
                  {section.title}
                </p>
              </div>
              <div className="flex flex-col justify-center text-center w-[40%] rounded-2xl h-auto relative">
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

export default Carousel
