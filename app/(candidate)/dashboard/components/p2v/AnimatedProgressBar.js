'use client';

import { useEffect, useState } from 'react';

export function AnimatedProgressBar({ percent, bgColor }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (percent > 100) {
      setWidth(100);
      return;
    }
    setWidth(percent);
  }, [percent]);

  return (
    <div className="bg-primary h-2 rounded relative bg-opacity-10 mt-2">
      <div
        className={`${bgColor} h-2 rounded absolute top-0 left-0 transition-all duration-700`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
