'use client'
import React, { useRef, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { PiUploadSimpleBold } from 'react-icons/pi';
import Link from 'next/link';
import { DynamicSVGIcon } from './DynamicSVGIcon';
import Image from 'next/image'
import { SvgIconImage } from './SvgIconImage';

export const SVGIconChooser = ({
  svgData = null,
  setSvgData = () => {
  },
}) => {
  const fileInputRef = useRef(null);
  const [buttonWrapHover, setButtonHover] = useState(false);

  const handleUploadSvgClick = e => {
    fileInputRef.current.click();
  };

  const handleFileInputOnChange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setSvgData(reader.result);
    reader.readAsText(file);
  };

  const handleRemoveClick = e => {
    e.preventDefault();
    fileInputRef.current.value = null;
    setSvgData(null);
  };

  return <div>
    <div
      onMouseEnter={() => setButtonHover(true)}
      onMouseLeave={() => setButtonHover(false)}
      className="relative block min-w-[2.5rem] min-h-[2.5rem]">
      {
        svgData && (
          svgData.startsWith('http') ?
            <SvgIconImage src={svgData} /> :
            <DynamicSVGIcon
              svgData={svgData}
              className={buttonWrapHover ? 'opacity-40' : ''}
            />
        )
      }
      <Tooltip
        title={`${svgData ? 'Change' : 'Upload an'} SVG icon`}
        placement="top"
      >
        <IconButton
          className={`absolute z-10 left-0 top-0${
            svgData ? ' opacity-0 hover:opacity-100' : ''
          }`}
          onClick={handleUploadSvgClick} >
          <PiUploadSimpleBold
            className="text-black" />
        </IconButton>
      </Tooltip>
      <input
        className="hidden"
        ref={fileInputRef}
        type="file"
        accept=".svg"
        onChange={handleFileInputOnChange} />
    </div>
    {
      svgData && <Link
        className="text-xs"
        href="#"
        onClick={handleRemoveClick}
      >Remove</Link>
    }
  </div>;
};
