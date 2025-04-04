'use client'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import Map from './Map'
import Results from './Results'
import Filters from './Filters'
import CampaignPreview from './CampaignPreview'
import WinnerListSection from '../winners/WinnerListSection'
import { useMapCampaigns } from '@shared/hooks/useMapCampaigns'
import ShareMap from './ShareMap'
import { useRouter } from 'next/navigation'
import { isObjectEqual } from 'helpers/objectHelper'
import { CircularProgress } from '@mui/material'

export default memo(function MapSection({
  isLoaded,
  state,
  searchParams,
  count,
}) {
  const router = useRouter()
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [visibleCampaigns, setVisibleCampaigns] = useState(null)
  const [mapBounds, setMapBounds] = useState()
  const mapRef = useRef(null)
  const [filters, setFilters] = useState({
    party: searchParams?.party || '',
    state: state || searchParams?.state || '',
    level: searchParams?.level || '',
    results: searchParams?.results ? searchParams?.results === 'true' : true, // default to filter for winners
    office: searchParams?.office || '',
    name: searchParams?.name || '',
  })
  const { campaigns, isCampaignsLoading: loading } = useMapCampaigns(filters)

  useEffect(() => {
    setFilters((currentFilters) => {
      const searchParamFilters = {
        party: searchParams?.party || currentFilters.party,
        state: state || searchParams?.state || currentFilters.state,
        level: searchParams?.level || currentFilters.level,
        results: searchParams?.results
          ? searchParams?.results === 'true'
          : currentFilters.results,
        office: searchParams?.office || currentFilters.office,
        name: searchParams?.name || currentFilters.name,
      }

      return isObjectEqual(currentFilters, searchParamFilters)
        ? currentFilters
        : searchParamFilters
    })
  }, [searchParams, state])

  useEffect(() => {
    // filter visible campaigns
    if (mapBounds) {
      const visibleCampaigns = campaigns.filter((camp) =>
        mapBounds.contains(camp.globalPosition),
      )
      setVisibleCampaigns(visibleCampaigns)
      return
    }

    setVisibleCampaigns(null)
  }, [campaigns, mapBounds])

  const onChangeFilters = useCallback(
    (key, val) => {
      setFilters((currentFilters) => {
        // return same filter object if no filters values changed
        if (currentFilters[key] === val) {
          return currentFilters
        }

        const updatedFilters = {
          ...searchParams,
          ...currentFilters,
          [key]: val,
        }

        // add the filters to the url query only if they are not empty
        const query = Object.entries(updatedFilters).reduce(
          (acc, [key, val]) => {
            if (val) {
              acc[key] = val
            }
            return acc
          },
          {},
        )

        const queryString = new URLSearchParams(query)
        router.push(`?${queryString.toString()}`, {
          scroll: false,
          shallow: true,
        })

        return updatedFilters
      })
    },
    [router, searchParams],
  )

  const onChangeMapBounds = useCallback((bounds) => {
    setMapBounds(bounds)
  }, [])

  const onSelectCampaign = useCallback((campaign) => {
    if (!mapRef.current) return

    setSelectedCampaign((currentSelected) => {
      if (
        !campaign ||
        (currentSelected && currentSelected.slug === campaign.slug)
      ) {
        return null
      }

      mapRef.current.moveMapWithHistory(campaign.globalPosition)

      return campaign
    })
  }, [])

  const onClusterClick = useCallback((cluster) => {
    if (!mapRef.current) return

    mapRef.current.moveMapWithHistory(cluster.bounds)
  }, [])

  const onZoomOut = useCallback(() => {
    if (!mapRef.current) return

    mapRef.current.moveMapWithHistory('full')
  }, [])

  return (
    <>
      <div className="bg-primary-dark">
        <section className="md:h-[calc(100vh-56px)] bg-primary-dark px-4 lg:px-8 overflow-hidden relative">
          <div className="md:flex flex-row-reverse rounded-2xl overflow-hidden">
            <div className="relative flex-1 h-3/4 md:h-auto">
              {loading && (
                <div className="absolute inset-0 z-50 bg-black/[0.6] pointer-events-none flex justify-center items-center">
                  <CircularProgress
                    size={80}
                    variant="indeterminate"
                    disableShrink
                  />
                </div>
              )}
              <Map
                ref={mapRef}
                campaigns={campaigns}
                isLoaded={isLoaded}
                onChangeMapBounds={onChangeMapBounds}
                onSelectCampaign={onSelectCampaign}
                onClusterClick={onClusterClick}
              />
            </div>
            <div className="flex flex-col shadow-lg md:relative z-20">
              <Filters
                campaigns={campaigns}
                filters={filters}
                onChangeFilters={onChangeFilters}
              />
              <Results
                onZoomOut={onZoomOut}
                totalNumCampaigns={campaigns.length}
                count={count}
                campaigns={visibleCampaigns || campaigns}
                onSelectCampaign={onSelectCampaign}
                selectedCampaign={selectedCampaign}
              />
              <CampaignPreview
                selectedCampaign={selectedCampaign}
                onSelectCampaign={onSelectCampaign}
              />
            </div>
          </div>
        </section>
        <ShareMap />
        <div className="h-4 md:h-8 bg-primary-dark">&nbsp;</div>
      </div>
      <WinnerListSection />
    </>
  )
})
