import React, { useRef, useState } from 'react';
import InlineSVG from 'react-inlinesvg';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { PiUploadSimpleBold } from 'react-icons/pi';
import Link from 'next/link';

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
    console.log(`handleFileUpload =>`, e);
    const file = e.target.files[0];
    console.log(`file =>`, file);
    const reader = new FileReader();
    reader.onloadend = e => {
      console.log(`reader.result =>`, reader.result);
      setSvgData(reader.result);
    };

    reader.readAsText(file);
  };

  const handleRemoveClick = (e) => {
    e.preventDefault();
    fileInputRef.current.value = null;
    setSvgData(null);
  };

  return <div>
    <div {...{
      onMouseEnter: () => setButtonHover(true),
      onMouseLeave: () => setButtonHover(false),
      className: `relative block min-w-[2.5rem] min-h-[2.5rem]`,
    }}>
      {
        svgData &&
        <InlineSVG {...{
          src: svgData,
          className: `relative block w-[2.5rem] h-[2.5rem]${
            buttonWrapHover ? ' opacity-40' : ''
          }`,
        }} />
      }
      <Tooltip {...{
        title: `${svgData ? 'Change' : 'Upload an'} SVG icon`,
        placement: 'top',
      }}>
        <IconButton {...{
          className: `absolute z-10 left-0 top-0${
            svgData ?
              ' opacity-0 hover:opacity-100' : ''
          }`,
          onClick: handleUploadSvgClick,
        }}>
          <PiUploadSimpleBold {...{
            className: 'text-black',
          }} />
        </IconButton>
      </Tooltip>
      <input {...{
        className: 'hidden',
        ref: fileInputRef,
        type: 'file',
        accept: '.svg',
        onChange: handleFileInputOnChange,
      }} />
    </div>
    {
      svgData && <Link {...{
        className: 'text-xs',
        href: '#',
        onClick: handleRemoveClick,
      }}>Remove</Link>
    }
  </div>;
};
