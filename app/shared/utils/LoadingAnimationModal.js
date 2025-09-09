'use client'
import React from 'react'
import { LoadingAnimation } from '@shared/utils/LoadingAnimation'

const LoadingAnimationModal = ({ label, fullPage = true, title }) => (
  <div
    className={`flex justify-center items-center p-8 w-full flex-col ${
      fullPage &&
      'fixed top-0 left-0 h-screen w-screen p-0 z-40 bg-[rgba(0,0,0,0.8)]'
    }`}
  >
    <LoadingAnimation
      {...{
        title,
        label,
      }}
    />
  </div>
)

export default LoadingAnimationModal

