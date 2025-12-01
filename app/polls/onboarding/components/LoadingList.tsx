'use client'
import { useState, useEffect } from 'react'
import { FaRegHourglass } from 'react-icons/fa'
import { FaCheck } from 'react-icons/fa6'
import { LuLoaderCircle } from 'react-icons/lu'

const STATUS_PENDING = 'pending'
const STATUS_LOADING = 'loading'
const STATUS_COMPLETE = 'complete'
const LOADING_DELAY = 1250

interface LoadingItem {
  label?: string
  status: string
}

interface LoadingListProps {
  items: LoadingItem[]
  onComplete: () => void
}

export default function LoadingList({ items, onComplete }: LoadingListProps): React.JSX.Element {
  
  const [loadingItems, setLoadingItems] = useState(items)

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingItems(prevItems => {
        const currentLoadingIndex = prevItems.findIndex(item => item.status === STATUS_LOADING)

        if (currentLoadingIndex === -1) {
          clearInterval(timer)
          return prevItems
        }

        const newItems = [...prevItems]

        newItems[currentLoadingIndex] = {
          ...newItems[currentLoadingIndex],
          status: STATUS_COMPLETE
        }

        if (currentLoadingIndex + 1 < newItems.length) {
          newItems[currentLoadingIndex + 1] = {
            ...newItems[currentLoadingIndex + 1],
            status: STATUS_LOADING
          }
        }

        return newItems
      })
    }, LOADING_DELAY)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (loadingItems.length > 0 && loadingItems.every(item => item.status === STATUS_COMPLETE)) {
      onComplete()
    }
  }, [loadingItems, onComplete])

  return (
    <div className="flex flex-col gap-4 mt-5 w-full ml-1">
      {loadingItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center">
            {item.status === STATUS_PENDING && (
              <FaRegHourglass className="text-gray-400 text-sm" />
            )}
            {item.status === STATUS_LOADING && (
              <LuLoaderCircle aria-label="Loading" className="text-blue-500 animate-spin text-xl" />
            )}
            {item.status === STATUS_COMPLETE && (
              <FaCheck className="text-success" />
            )}
          </div>
          <p className="text-base">{item.label}</p>
        </div>
      ))}
    </div>
  )
}

