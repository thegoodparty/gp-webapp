'use client';
import { forwardRef } from 'react';

const AcknowledgementTitleBar = ({ emoticon, title }, ref) => (
  <div
    ref={ref}
    className="scroll-mt-16 bg-gray-200 p-4 font-bold rounded mb-6 flex items-center"
  >
    {emoticon || <></>}
    <div>{title}</div>
  </div>
);

export default forwardRef(AcknowledgementTitleBar);
