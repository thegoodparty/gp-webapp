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
      <div className="m-0 w-[450px] md:w-[700px] lg:w-[900px] h-[425px] md:h-[350px] lg:[300px] bg-indigo-700 rounded-2xl text-white">
        <Slider {...settings}>
          {this.props.sections.map((section, index) => (
            <div key={section.name}>
              <div className="flex h-[425px] md:h-[350px] lg:[300px] w-full">
                <div className="flex flex-col justify-center items-center text-center w-2/3">
                  <h3 className="text-xl text-slate-100 pr-5 pl-5">
                    {this.props.sections[index].description}
                  </h3>

                  <p className="mt-3 text-lg max-w-[90vw] text-slate-300">
                    - {this.props.sections[index].name}
                  </p>
                  <p className="mt-2 text-md max-w-[90vw] text-indigo-200 pb-5">
                    {this.props.sections[index].title}
                  </p>
                </div>
                <div className="flex flex-col justify-center items-center text-center w-1/3 rounded-2xl h-full relative">
                  <Image
                    src={this.props.sections[index].img}
                    sizes="100vw"
                    fill
                    className="object-cover rounded-tr-2xl rounded-br-2xl"
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
