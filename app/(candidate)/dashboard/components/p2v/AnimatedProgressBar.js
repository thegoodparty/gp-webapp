'use client';

import { useEffect, useState } from 'react';

export const ANIMATED_PROGRESS_BAR_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
};

const calculateColor = (percent) => {
  let bgColor = 'bg-black';
  if (percent > 0 && percent < 20) {
    bgColor = 'bg-error-main';
  }
  if (percent > 20) {
    bgColor = 'bg-warning-main';
  }
  if (percent > 75) {
    bgColor = 'bg-success-main';
  }
  return bgColor;
};

const ANIMATED_PROGRESS_BAR_SIZE_MAP = {
  [ANIMATED_PROGRESS_BAR_SIZES.SM]: 'h-2',
  [ANIMATED_PROGRESS_BAR_SIZES.MD]: 'h-4',
  [ANIMATED_PROGRESS_BAR_SIZES.LG]: 'h-6',
};
export function AnimatedProgressBar({
  percent,
  size = ANIMATED_PROGRESS_BAR_SIZES.SM,
}) {
  const width = percent > 100 ? 100 : percent < 0 ? 0 : percent;

  return (
    <div
      className={`bg-primary ${ANIMATED_PROGRESS_BAR_SIZE_MAP[size]} rounded-full relative bg-opacity-10`}
    >
      <div
        className={`${calculateColor(
          percent,
        )} h-full rounded-full absolute top-0 left-0 transition-all duration-700`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
