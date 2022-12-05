'use client';

import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ImBlocked } from 'react-icons/im';

import styles from './CampaignColorPicker.module.scss';
import { updateCandidateCallback } from './EditCampaignPage';

// import ColorPicker from '../CandidatePortalHomeWrapper/ColorPicker';

const bright = ['#FEBE36', '#FA5820', '#FE0F6E', '#8239E6', '#3A86FA'];
const muted = ['#EE496F', '#FFD171', '#19D5A2', '#168AB0', '#083B4B'];
const pastel = [
  '#FD6E75',
  '#02055B',
  '#4995EB',
  '#093D74',
  '#ED9654',
  '#F8593F',
  '#62BB47',
  '#3600FF',
  '#3D3488',
  '#562C2D',
  '#159593',
  '#167474',
  '#B41B9B',
  '#710DB2',
  '#550EA9',
];

const political = [
  { color: '#E5C601', party: 'Libertarian' },
  { color: '#00A95C', party: 'Green' },
  { color: '#D71F28', party: 'Republican', wrong: true },
  { color: '#0044C9', party: 'Democrat', wrong: true },
];

const colors = [];
bright.forEach((color) => {
  colors.push({ color, type: 'bright' });
});
muted.forEach((color) => {
  colors.push({ color, type: 'muted' });
});
pastel.forEach((color) => {
  colors.push({ color, type: 'pastel' });
});
political.forEach((color) => {
  colors.push({ ...color, type: 'political' });
});

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 8,
  slidesToScroll: 8,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 6,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
  ],
};

const groups = [
  { name: 'Bright', slide: 0 },
  { name: 'Muted', slide: bright.length },
  { name: 'Pastel', slide: bright.length + muted.length },
  { name: 'Political', slide: bright.length + muted.length + pastel.length },
];

function CampaignColorPicker({ candidate }) {
  const slider = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [selected, setSelected] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(groups[0]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (candidate?.color) {
      setSelected(candidate.color);
    }
  }, [candidate]);

  if (!isMounted) {
    return null;
  }

  const selectColor = (color) => {
    if (color.wrong) {
      return;
    }
    setSelected(color);
    updateCandidateCallback(candidate.id, {
      ...candidate,
      color,
    });
  };

  const slideToGroup = (group) => {
    slider.current?.slickGoTo(group.slide);
  };

  settings.afterChange = (current) => {
    if (current >= groups[3].slide) {
      setSelectedGroup(groups[3]);
      return;
    }
    if (current >= groups[2].slide) {
      setSelectedGroup(groups[2]);
      return;
    }
    if (current >= groups[1].slide) {
      setSelectedGroup(groups[1]);
      return;
    }
    setSelectedGroup(groups[0]);
  };

  const handleColorPicker = (color) => {
    debounce(selectColor, { color, type: 'custom' });
  };

  function debounce(func, args, timeout = 600) {
    clearTimeout(window.timer);
    window.timer = setTimeout(() => {
      func(args);
    }, timeout);
  }
  return (
    <div className={`mb-3 ${styles.wrapper}`}>
      <div className="row">
        <div className="mr-11 text-zinc-600 mb-6 cursor-pointer">
          Campaign Colors
        </div>
        {groups.map((group) => (
          <div
            className="mr-7 text-zinc-600 mb-6 cursor-pointer"
            key={group.name}
            style={
              group.name === selectedGroup.name
                ? {
                    fontWeight: '900',
                    color: '#000',
                    textDecoration: 'underline',
                  }
                : {}
            }
            onClick={() => {
              slideToGroup(group);
            }}
          >
            {group.name}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: '1060px', overflow: 'hidden', height: '300px' }}>
        <Slider {...settings} ref={slider}>
          {colors.map((color) => (
            <div className="pr-1" key={color.color}>
              <div
                className="h-60 relative rounded-md text-white cursor-pointer flex items-center justify-center"
                style={
                  color.wrong
                    ? { backgroundColor: color.color, cursor: 'not-allowed' }
                    : { backgroundColor: color.color }
                }
                onClick={() => selectColor(color)}
              >
                {color.type === 'political' && (
                  <div className="absolute w-full text-center text-xs left-0 top-4 font-black">
                    {color.party}
                  </div>
                )}
                {color.wrong && (
                  <div className="text-center text-xs left-0 top-4">
                    <ImBlocked size={36} />

                    <div style={{ marginTop: '6px' }}>Wrong Site</div>
                  </div>
                )}
                <div className="absolute w-full text-center text-xs left-0 bottom-3">
                  {color.color}
                </div>
              </div>
              <div
                className="inline-block w-[60%] ml-[20%] h-2 rounded-md mt-2"
                style={
                  color.color === selected.color
                    ? { backgroundColor: color.color }
                    : {}
                }
              />
            </div>
          ))}
          {/* <div>
          <ColorPicker mode="lean" onColorPick={handleColorPicker} />
        </div> */}
          <div>&nbsp;</div>
          <div>&nbsp;</div>
        </Slider>
      </div>
    </div>
  );
}

export default CampaignColorPicker;
