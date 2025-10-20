'use client'
import { useState, useEffect } from 'react'
import { FaRegHourglass } from 'react-icons/fa'
import { FaCheck } from 'react-icons/fa6'
import { LuLoaderCircle } from 'react-icons/lu'

const STATUS_PENDING = 'pending'
const STATUS_LOADING = 'loading'
const STATUS_COMPLETE = 'complete'
const LOADING_DELAY = 2000

// items: [{ label: string, status: string }]
// onComplete: () => void
// disabled: boolean - prevents timer from running
export default function LoadingList({ items, onComplete, disabled = false }) {
  const [loadingItems, setLoadingItems] = useState(items)

  useEffect(() => {
    // Don't start timer if disabled
    if (disabled) {
      return
    }

    const timer = setInterval(() => {
      setLoadingItems((prevItems) => {
        const currentLoadingIndex = prevItems.findIndex(
          (item) => item.status === STATUS_LOADING,
        )

        if (currentLoadingIndex === -1) {
          // No loading item found, clear the timer
          clearInterval(timer)
          return prevItems
        }

        const newItems = [...prevItems]

        // Mark current loading item as complete
        newItems[currentLoadingIndex] = {
          ...newItems[currentLoadingIndex],
          status: STATUS_COMPLETE,
        }

        // Start loading the next item if there is one
        if (currentLoadingIndex + 1 < newItems.length) {
          newItems[currentLoadingIndex + 1] = {
            ...newItems[currentLoadingIndex + 1],
            status: STATUS_LOADING,
          }
        }

        return newItems
      })
    }, LOADING_DELAY) // 2 seconds delay

    // Cleanup timer on component unmount
    return () => clearInterval(timer)
  }, [disabled])

  // Call onComplete when all steps are complete
  useEffect(() => {
    if (
      !disabled &&
      loadingItems.length > 0 &&
      loadingItems.every((item) => item.status === STATUS_COMPLETE)
    ) {
      onComplete()
    }
  }, [loadingItems, onComplete, disabled])

  return (
    <div className="flex flex-col gap-4 mt-5 w-full ml-1">
      {loadingItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center">
            {item.status === STATUS_PENDING && (
              <FaRegHourglass
                className={`text-sm ${
                  disabled ? 'text-gray-300' : 'text-gray-400'
                }`}
              />
            )}
            {item.status === STATUS_LOADING && (
              <LuLoaderCircle
                aria-label="Loading"
                className={`text-xl ${
                  disabled ? 'text-gray-300' : 'text-blue-500 animate-spin'
                }`}
              />
            )}
            {item.status === STATUS_COMPLETE && (
              <FaCheck className="text-success" />
            )}
          </div>
          <p className={`text-base ${disabled ? 'text-gray-400' : ''}`}>
            {item.label}
          </p>
        </div>
      ))}
    </div>
  )
}
