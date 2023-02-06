'use client';
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingAnimation = ({ label, fullPage = true }) => (
  <div
    className={`flex justify-center items-center p-8 w-full flex-col ${
      fullPage &&
      'fixed top-0 left-0 h-screen w-screen p-0 z-40 bg-[rgba(0,0,0,0.8)] text-white'
    }`}
  >
    <div className="text-center">
      {label && (
        <h3 className="text-xl font-bold mb-6">
          {label}
          <br />
          &nbsp;
        </h3>
      )}
      <CircularProgress />
    </div>
  </div>
);

export default LoadingAnimation;
