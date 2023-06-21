'use client';

import React, { Component } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import './slick.min.css';
import './slick-theme.min.css';

export default class Carousel extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
    };
    return (
      <div className="m-0 w-[350px] md:w-[700px] lg:w-[900px] h-[425px] md:h-[350px] lg:[300px] bg-indigo-700 rounded-2xl text-white">
        <Slider {...settings}>
          {this.props.sections.map((section, index) => (
            <div key={section.name}>
              <div className="flex h-[425px] md:h-[350px] lg:[300px] w-full">
                <div className="flex flex-col justify-center items-center text-start w-[60%]">
                  <h3 className="text-[15px] md:text-[24px] lg:text-[28px] leading-6 lg:leading-10 font-semibold text-slate-100 pr-5 pl-5">
                    {this.props.sections[index].description}
                  </h3>

                  <p className="mt-3 text-[15px] md:text-[24px] lg:text-[28px] leading-6 lg:leading-10 font-normal text-slate-300 text-end w-full pr-5 md:pr-20">
                    - {this.props.sections[index].name}
                  </p>
                  <p className="text-[12px] md:text-[20px] lg:text-[24px] leading-6 lg:leading-10 font-normal text-indigo-200 text-end w-full pr-5 md:pr-20">
                    {this.props.sections[index].title}
                  </p>
                  <p className="text-[12px] md:text-[20px] lg:text-[24px] leading-6 lg:leading-10 font-normal text-indigo-300 pb-2 text-end w-full pr-5 md:pr-20">
                    {this.props.sections[index].subtitle}
                  </p>
                </div>
                <div className="flex flex-col justify-center items-center text-center w-[40%] rounded-2xl h-full relative">
                  <Image
                    src={this.props.sections[index].img}
                    fill
                    sizes="100vw"
                    className="object-cover rounded-2xl"
                    alt={this.props.sections[index].name}
                  />
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    );
  }
}
