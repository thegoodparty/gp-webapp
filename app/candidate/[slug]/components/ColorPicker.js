'use client';
import CustomColorPicker from './CustomColorPicker';
import Image from 'next/image';
import { useState } from 'react';

export default function ColorPicker({ color, updateColorCallback }) {
  const [showPicker, setShowPicker] = useState(false);

  const onColorChange = (color) => {
    console.log('color', color);
    updateColorCallback(color);
  };
  return (
    <div className="inline-block relative">
      <div
        className="inline-flex px-4 py-2 text-lg font-black bg-violet-100 rounded-full  items-center cursor-pointer group "
        style={{ color }}
        onClick={() => setShowPicker(!showPicker)}
      >
        <Image
          src="/images/campaign/color-wheel.svg"
          width={30}
          height={30}
          alt="Image picker"
          className="mr-3 transition-transform group-hover:rotate-180"
        />{' '}
        EDIT
      </div>
      {showPicker ? (
        <div className="mt-3 relative">
          <CustomColorPicker onColorPick={onColorChange} initialColor={color} />
        </div>
      ) : null}
    </div>
  );
}
