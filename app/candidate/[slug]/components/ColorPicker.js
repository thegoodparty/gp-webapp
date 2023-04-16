'use client';
import CustomColorPicker from 'app/(candidate)/candidate-portal/[id]/edit-campaign/components/CustomColorPicker';
import Image from 'next/image';
import pickerImg from 'public/images/color-wheel.png';
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
        className="inline-flex px-4 py-2 text-lg font-black bg-violet-100 rounded-full  items-center cursor-pointer"
        style={{ color }}
        onClick={() => setShowPicker(!showPicker)}
      >
        <Image src={pickerImg} alt="Image picker" className="mr-3" /> EDIT
      </div>
      {showPicker ? (
        <div className="mt-3 relative">
          <CustomColorPicker onColorPick={onColorChange} initialColor={color} />
        </div>
      ) : null}
    </div>
  );
}
