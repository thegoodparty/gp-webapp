'use client';
import { MdArrowForwardIos, MdOutlineArrowBackIosNew } from 'react-icons/md';
import Slider from 'react-slick';
import {
  MONTHS,
  TeamMilestoneCard,
} from 'app/(company)/team/components/TeamMilestoneCard';
import '@shared/inputs/slick.min.css';
import '@shared/inputs/slick-theme.min.css';
import './CarouselContainer.scss';

const sortMilestones = (
  { month: aMonth, year: aYear },
  { month: bMonth, year: bYear },
) => {
  const aMonthIndex = MONTHS.findIndex(
    (m) =>
      m.month.toLowerCase() === aMonth.toLowerCase() ||
      m.abbreviation.toLowerCase() === aMonth.toLowerCase(),
  );
  const bMonthIndex = MONTHS.findIndex(
    (m) =>
      m.month.toLowerCase() === bMonth.toLowerCase() ||
      m.abbreviation.toLowerCase() === bMonth.toLowerCase(),
  );
  if (aYear === bYear) {
    return aMonthIndex - bMonthIndex;
  }
  return aYear - bYear;
};
const BaseCarouselArrow = ({ className, style, onClick, children }) => {
  return (
    <button
      className={`
        ${className} 
        !absolute
        !top-auto
        !-bottom-20
        !text-5xl 
        !right-0 
        !text-black
        !h-auto
        !w-auto
        !transform-none
      `}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
const PrevArrow = ({ className, style, onClick }) => {
  return (
    <BaseCarouselArrow
      {...{
        className: `${className} !left-4`,
        style,
        onClick,
      }}
    >
      <MdOutlineArrowBackIosNew />
    </BaseCarouselArrow>
  );
};
const NextArrow = ({ className, style, onClick }) => {
  return (
    <BaseCarouselArrow
      {...{
        className: `${className} !right-auto !left-24`,
        style,
        onClick,
      }}
    >
      <MdArrowForwardIos />
    </BaseCarouselArrow>
  );
};
const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />,
  responsive: [
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
  ],
};
export const TeamMilestonesCarousel = ({ teamMilestones }) => {
  if (!teamMilestones) {
    return null;
  }
  return (
    <div className="carousel-container relative">
      <Slider {...settings}>
        {teamMilestones.sort(sortMilestones).map((milestone, key) => (
          <TeamMilestoneCard {...milestone} key={key} />
        ))}
      </Slider>
    </div>
  );
};
