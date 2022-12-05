'use client';

import React, { useState, useEffect } from 'react';
import { ChromePicker } from 'react-color';

export default function CustomColorPicker({
  onColorPick,
  initialColor = '#000',
}) {
  const [color, setColor] = useState(initialColor);
  useEffect(() => {
    setColor(initialColor);
  }, [initialColor]);
  const handleColorChange = (color) => {
    setColor(color.hex);
    onColorPick(color.hex);
  };
  return (
    <ChromePicker color={color} onChange={handleColorChange} disableAlpha />
  );
}
