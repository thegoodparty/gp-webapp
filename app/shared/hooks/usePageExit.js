'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Hook that detects when a user leaves a page and how they left
 * @param {function} callback - Callback function that receives a boolean:
 *                             - true: user closed the window/tab
 *                             - false: user navigated to another page
 */
export function usePageExit(callback) {
  const pathname = usePathname();
  const isUnloading = useRef(false);

  useEffect(() => {
    const handleBeforeUnload = () => {
      isUnloading.current = true;
      callback(true); // true = window close
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // If unmounting but not due to window close, it must be navigation
      if (!isUnloading.current) {
        callback(false); // false = navigation
      }

      // Reset flag
      isUnloading.current = false;
    };
  }, [callback, pathname]);
}
