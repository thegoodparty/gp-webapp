'use client';
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingAnimation = ({ label, fullPage = true }) => (
  <div className={`flex justify-center items-center p-8 w-full flex-col ${fullPage && 'h-[calc(100vh - 75px - 4rem)] p-0'}`}>
    {label && (
      <h3 className="h3">
        {label}
        <br />
        &nbsp;
      </h3>
    )}
    <CircularProgress />
  </div>
);

export default LoadingAnimation;
