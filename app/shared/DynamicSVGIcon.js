import InlineSVG from 'react-inlinesvg';
import React from 'react';

export const DynamicSVGIcon = ({
  svgData,
  className,
}) => {
  console.log(`svgData =>`, svgData)
  return <InlineSVG {...{
    src: svgData,
    className: `relative block w-[2.5rem] h-[2.5rem]${
      className ? ` ${className}` : ''
    }`,
  }} />;
};
