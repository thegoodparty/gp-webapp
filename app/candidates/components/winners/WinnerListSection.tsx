'use client'
import MarketingH2 from '@shared/typography/MarketingH2'
import MarketingH4 from '@shared/typography/MarketingH4'
import Image from 'next/image'
import WinnerFilters from './WinnerFilters'
import MaxWidth from '@shared/layouts/MaxWidth'
import { memo, useEffect, useState } from 'react'
import FilteredWinnerList from './FilteredWinnerList'
import { useMapCampaigns } from '@shared/hooks/useMapCampaigns'
import { Campaign } from 'helpers/types'

const WINNER_FILTER = { results: true }

interface WinnerFiltersState {
  state?: string
  office?: string
  level?: string
}

export default memo(function WinnerListSection(): React.JSX.Element {
  const { campaigns: allCampaigns } = useMapCampaigns(WINNER_FILTER)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [offices, setOffices] = useState<string[]>([])

  useEffect(() => {
    const allOffices = allCampaigns
      .map((campaign) => campaign.office)
      .filter((office): office is string => Boolean(office))
    const offices = [...new Set(allOffices)] // dedupe

    setCampaigns(allCampaigns)
    setOffices(offices)
  }, [allCampaigns])

  const [filters, setFilters] = useState<WinnerFiltersState>({
    state: '',
    office: '',
    level: '',
  })

  const onChangeFilters = (newFilters: WinnerFiltersState): void => {
    setFilters(newFilters)

    const filteredCampaigns = allCampaigns.filter((campaign) => {
      const { state, office, level } = newFilters

      const stateMatch =
        typeof state === 'string' && state !== ''
          ? campaign.state === state
          : true
      const officeMatch =
        typeof office === 'string' && office !== ''
          ? campaign.office === office
          : true
      const levelMatch =
        typeof level === 'string' && level !== ''
          ? campaign.ballotLevel === level
          : true

      return stateMatch && officeMatch && levelMatch
    })

    setCampaigns(filteredCampaigns)
  }

  return (
    <div className="py-8 px-4 lg:p-16">
      <MaxWidth>
        <MarketingH2 className="text-center">
          <span className="">
            {campaigns.length > 0 ? campaigns.length : ''} independents won
            using
            <Image
              src="/images/heart.svg"
              width={60}
              height={60}
              alt="gp.org"
              className="mx-3 mt-3 static inline-block w-12 h-12 lg:w-16 lg:h-16"
              priority
            />{' '}
            tools
          </span>
        </MarketingH2>
        <MarketingH4 className="mt-8 text-center mb-12">
          Learn who is leading the charge for independents in local elections
        </MarketingH4>
        <WinnerFilters
          filters={filters}
          onChangeFilters={onChangeFilters}
          offices={offices}
        />
        <FilteredWinnerList campaigns={campaigns} />
      </MaxWidth>
    </div>
  )
})
