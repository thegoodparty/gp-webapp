'use client';
import React, { useEffect, useState } from 'react';

let imgElement;
const ImageWithScroll = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    if (!imgElement) {
      imgElement = document.getElementById('homepage-scroll-image');
    }
    function onScroll() {
      let currentPosition = window.pageYOffset; // or use document.documentElement.scrollTop;
      if (currentPosition <= 0 && isScrolled) {
        imgElement.classList.remove('back');
        setIsScrolled(false);
      } else if (currentPosition > 0 && !isScrolled) {
        imgElement.classList.add('back');
        setIsScrolled(true);
      }
    }

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isScrolled]);
  return <></>;
};

export default ImageWithScroll;
