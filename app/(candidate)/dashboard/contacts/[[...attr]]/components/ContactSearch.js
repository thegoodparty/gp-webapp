'use client'

import SearchInput from 'app/(candidate)/dashboard/issues/components/search/SearchInput'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useShowContactProModal } from '../hooks/ContactProModal'
import { useCampaign } from '@shared/hooks/useCampaign'

export const ContactSearch = () => {
  const [campaign] = useCampaign()
  const showProUpgradeModal = useShowContactProModal()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchText, setSearchText] = useState(
    () => searchParams.get('query') ?? '',
  )

  useEffect(() => {
    setSearchText(searchParams.get('query') ?? '')
  }, [searchParams.get('query')])

  return (
    <div className="w-full max-w-md">
      <SearchInput
        fullWidth
        variant="standard"
        placeholder="Search contacts by name or phone number"
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (!campaign?.isPro) {
              showProUpgradeModal(true)
              return
            }
            const params = new URLSearchParams({ query: searchText })
            router.push(`?${params.toString()}`)
          }
        }}
      />
      <div
        className={`text-xs text-gray-500 mt-1 transition-all duration-200 ${
          searchText ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
        }`}
      >
        Press Enter to search
      </div>
    </div>
  )
}
