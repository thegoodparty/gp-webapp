
import { useState, useEffect } from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config.js';

const fullConfig = resolveConfig(tailwindConfig);
const breakpoints = fullConfig.theme.screens;

export const useTailwindBreakpoints = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState('sm');

  useEffect(() => {
    const getCurrentBreakpoint = () => {
      const width = window.innerWidth;
      
      // Check breakpoints from largest to smallest
      if (width >= parseInt(breakpoints['2xl'])) {
        setCurrentBreakpoint('2xl');
      } else if (width >= parseInt(breakpoints.xl)) {
        setCurrentBreakpoint('xl');
      } else if (width >= parseInt(breakpoints.lg)) {
        setCurrentBreakpoint('lg');
      } else if (width >= parseInt(breakpoints.md)) {
        setCurrentBreakpoint('md');
      } else if (width >= parseInt(breakpoints.sm)) {
        setCurrentBreakpoint('sm');
      } else {
        setCurrentBreakpoint('xs');
      }
    };

    // Set initial breakpoint
    getCurrentBreakpoint();

    // Listen for resize events
    window.addEventListener('resize', getCurrentBreakpoint);

    // Cleanup
    return () => window.removeEventListener('resize', getCurrentBreakpoint);
  }, []);

  return currentBreakpoint;
};