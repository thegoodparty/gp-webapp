'use client'
import React from 'react'

interface LoadingDotsProps {
  className?: string
  dotColor?: string
}

export default function LoadingDots({
  className = '',
  dotColor = 'bg-blue-500',
}: LoadingDotsProps) {
  return (
    <>
      <div className={`flex space-x-1 items-center ${className}`}>
        <div
          className={`w-1 h-1 ${dotColor} rounded-full pulse-scale-dot-1`}
        ></div>
        <div
          className={`w-1 h-1 ${dotColor} rounded-full pulse-scale-dot-2`}
        ></div>
        <div
          className={`w-1 h-1 ${dotColor} rounded-full pulse-scale-dot-3`}
        ></div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes pulse-scale-1 {
              0%, 33.33%, 100% {
                transform: scale(1);
                opacity: 0.5;
              }
              16.66% {
                transform: scale(2);
                opacity: 1;
              }
            }
            @keyframes pulse-scale-2 {
              0%, 33.33%, 66.66%, 100% {
                transform: scale(1);
                opacity: 0.5;
              }
              50% {
                transform: scale(2);
                opacity: 1;
              }
            }
            @keyframes pulse-scale-3 {
              0%, 66.66%, 100% {
                transform: scale(1);
                opacity: 0.5;
              }
              83.33% {
                transform: scale(2);
                opacity: 1;
              }
            }
            .pulse-scale-dot-1 {
              animation: pulse-scale-1 1.8s ease-in-out infinite;
            }
            .pulse-scale-dot-2 {
              animation: pulse-scale-2 1.8s ease-in-out infinite;
            }
            .pulse-scale-dot-3 {
              animation: pulse-scale-3 1.8s ease-in-out infinite;
            }
          `,
        }}
      />
    </>
  )
}
