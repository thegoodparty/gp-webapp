'use client'
import { useState, useEffect } from 'react'
import { FaRegHourglass } from 'react-icons/fa'
import { FaCheck } from 'react-icons/fa6'
import { LuLoaderCircle } from 'react-icons/lu'

// items: [{ label: string, status: string }]
// onComplete: () => void
export default function LoadingList({ items, onComplete }) {
  
  const [loadingItems, setLoadingItems] = useState(items);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingItems(prevItems => {
        const currentLoadingIndex = prevItems.findIndex(item => item.status === 'loading')

        if (currentLoadingIndex === -1) {
          // No loading item found, clear the timer
          clearInterval(timer)
          return prevItems
        }

        const newItems = [...prevItems]

        // Mark current loading item as complete
        newItems[currentLoadingIndex] = {
          ...newItems[currentLoadingIndex],
          status: 'complete'
        }

        // Start loading the next item if there is one
        if (currentLoadingIndex + 1 < newItems.length) {
          newItems[currentLoadingIndex + 1] = {
            ...newItems[currentLoadingIndex + 1],
            status: 'loading'
          }
        }

        return newItems
      })
    }, 2000) // 2 seconds delay

    // Cleanup timer on component unmount
    return () => clearInterval(timer)
  }, [])

  // Call onComplete when all steps are complete
  useEffect(() => {
    if (loadingItems.length > 0 && loadingItems.every(item => item.status === 'complete')) {
      onComplete()
    }
  }, [loadingItems, onComplete])

  return (
    <div className="flex flex-col gap-4 mt-5 w-full ml-1">
      {loadingItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center">
            {item.status === 'pending' && (
              <FaRegHourglass className="text-gray-400 text-sm" />
            )}
            {item.status === 'loading' && (
              <LuLoaderCircle className="text-blue-500 animate-spin text-xl" />
            )}
            {item.status === 'complete' && (
              <FaCheck className="text-success" />
            )}
          </div>
          <p className="text-base">{item.label}</p>
        </div>
      ))}
    </div>
  )
}
