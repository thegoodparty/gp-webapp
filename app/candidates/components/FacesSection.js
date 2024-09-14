'use client';
import MaxWidth from '@shared/layouts/MaxWidth';
import Body1 from '@shared/typography/Body1';
import H2 from '@shared/typography/H2';

import MarketingH2 from '@shared/typography/MarketingH2';
import MarketingH5 from '@shared/typography/MarketingH5';
import Image from 'next/image';
import Slider from 'react-slick';
const cards = [
  {
    name: 'Tom Simes',
    quote:
      "I want to be the candidate that I would want to see, someone who's non-partisan, not an ideologue, just somebody who wants to solve problems and be positive, inspirational, and aspirational.",
    office: 'State House Candidate, Arizona',
    image: 'https://assets.goodparty.org/map-search/lori-bryson.jpg',
  },
  {
    name: 'West Seegmiller',
    quote:
      "I am a candidate that will always fight for someone's right to disagree with me, to be heard and to be considered with respect — not to be attacked or vilified, and not to use a position of power to harm someone's life or livelihood. I'm an anti-corruption candidate, and I have the scars to prove it.",
    office: 'West Hollywood, CA City Council',
    image: 'https://assets.goodparty.org/map-search/lori-bryson.jpg',
  },
  {
    name: 'Patsy Nyberg',
    quote:
      "For me, it feels like we're entering into a new paradigm, and we need people that do not answer to political parties or special interest groups. That would be me. That's who I am. I can't be bought.",
    office: 'Cohcise County Supervisor',
    image: 'https://assets.goodparty.org/map-search/lori-bryson.jpg',
  },
  {
    name: 'Katrina Nguyen',
    quote:
      "I'm focusing on very non-partisan issues: food, plastic, waste, cost of living, affordable housing. Everyone understands these issues, and the way I approach them, I aim to be as solution-oriented as possible, where there's no partisanship involved in it. That's really how I'm different.",
    office: 'US House of Representatives, CO 5',
    image: 'https://assets.goodparty.org/map-search/lori-bryson.jpg',
  },
  {
    name: 'Andre Sandford',
    quote:
      "Even within politics, we can still make deals, we can still compromise, and we can still get things done. That's what I think America has started to lack, and that's what I want to bring into politics",
    office: 'CA House District 18',
    image: 'https://assets.goodparty.org/map-search/lori-bryson.jpg',
  },
  {
    name: 'Alicia Arellano',
    quote:
      "Where you live in your local community, that's where your local elected officials really impact your life. That's where the importance really is.",
    office: 'Miami-Dade County, Florida Community Council 14',
    image: 'https://assets.goodparty.org/map-search/lori-bryson.jpg',
  },
  {
    name: 'Eric Faulkner',
    quote:
      "The things that the city council does are across the political spectrum, because they're things that everybody wants. They want quality of life. They want good infrastructure. They want entrepreneurship and businesses to spark the economy. Those are the things we should be working on as a city council, not talking about things that are going to take us down rabbit holes and that we can't fix down here.",
    office: 'Temecula, CA City Council',
    image: 'https://assets.goodparty.org/map-search/lori-bryson.jpg',
  },
];

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  autoplaySpeed: 2000,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
};

export default function FacesSection() {
  return (
    <div className="bg-primary-dark py-8 lg:py-16">
      <MaxWidth>
        <MarketingH2 className="text-white text-center mb-12">
          Faces of the movement
        </MarketingH2>
        <Slider {...settings}>
          {cards.map((card) => (
            <div key={card.name} className="px-2">
              <div className="bg-indigo-100 rounded-3xl p-8 lg:flex">
                <div className="lg:w-48 lg:h-48 lg:flex-shrink-0 mb-8 lg:mb-0 flex justify-center ">
                  <Image
                    src={card.image}
                    width={192}
                    height={192}
                    alt={card.name}
                    className="rounded-3xl w-48 h-48 border border-slate-300"
                  />
                </div>
                <div className="lg:pl-8">
                  <MarketingH5>"{card.quote}"</MarketingH5>
                  <H2 className="mt-8">{card.name}</H2>
                  <Body1 className="mt-2">{card.office}</Body1>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </MaxWidth>
    </div>
  );
}
