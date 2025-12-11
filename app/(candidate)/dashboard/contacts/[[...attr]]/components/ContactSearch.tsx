'use client'

import { Input } from 'goodparty-styleguide'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useShowContactProModal } from '../hooks/ContactProModal'
import { useCampaign } from '@shared/hooks/useCampaign'
import { LuSearch } from 'react-icons/lu'

export const ContactSearch = () => {
  const [campaign] = useCampaign()
  const showProUpgradeModal = useShowContactProModal()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchText, setSearchText] = useState<string>(
    () => searchParams?.get('query') ?? '',
  )
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setSearchText(searchParams?.get('query') ?? '')
  }, [searchParams])

  const performSearch = useCallback(() => {
    if (!campaign?.isPro) {
      ;(showProUpgradeModal as (show: boolean) => void)(true)
      return
    }

    const params = new URLSearchParams(searchParams?.toString() ?? '')
    if (searchText) {
      params.set('query', searchText)
    } else {
      params.delete('query')
    }
    router.push(`?${params.toString()}`)
  }, [campaign?.isPro, searchParams, searchText, router, showProUpgradeModal])

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    const currentQuery = searchParams?.get('query') ?? ''
    if (searchText === currentQuery) {
      return
    }

    timeoutRef.current = setTimeout(() => {
      performSearch()
    }, 1000)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [searchText, performSearch, searchParams])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      performSearch()
    }
  }

  return (
    <div className="relative w-full">
      <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" />
      <Input
        className="pl-9 w-full"
        placeholder="Search contacts"
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value)
        }}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}
