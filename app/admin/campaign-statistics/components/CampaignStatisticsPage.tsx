'use client'

import PortalPanel from '@shared/layouts/PortalPanel'
import H2 from '@shared/typography/H2'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import SearchForm from './SearchForm'
import AdminCandidatesTable from 'app/admin/candidates/components/AdminCandidatesTable'
import { FiChevronRight } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { URLSearchParamsToObject } from 'helpers/URLSearchParamsToObject'
import { useSearchParams } from 'next/navigation'
import H4 from '@shared/typography/H4'
import { CircularProgress } from '@mui/material'
import Button from '@shared/buttons/Button'
import Link from 'next/link'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'

import { Campaign } from 'helpers/types'

interface CampaignStatisticsPageProps {
  pathname: string
  title: string
  campaigns?: Campaign[]
  fireHose?: boolean
}

const fetchCampaigns = async (): Promise<Campaign[]> => {
  try {
    const resp = await clientFetch<Campaign[]>(apiRoutes.campaign.list)
    return resp.data
  } catch (e) {
    console.error('error', e)
    return []
  }
}

const CampaignStatisticsPage = (
  props: CampaignStatisticsPageProps,
): React.JSX.Element => {
  const { fireHose } = props
  const [campaigns, setCampaigns] = useState(props.campaigns)
  const [showForm, setShowForm] = useState(true)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const searchParamsAreEmpty = !searchParams || !Object.keys(
    URLSearchParamsToObject(searchParams),
  ).length

  useEffect(() => {
    if (fireHose) {
      loadCampaigns()
    } else {
      setCampaigns(props.campaigns)
    }
  }, [fireHose, props.campaigns])

  const loadCampaigns = async () => {
    setLoading(true)
    const loadedCampaigns = await fetchCampaigns()
    setCampaigns(loadedCampaigns)
    setLoading(false)
  }

  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <div className="flex justify-between items-center">
          <H2
            className="cursor-pointer inline-flex items-center [&>svg]:inline [&>svg]:ml-1"
            onClick={() => setShowForm(!showForm)}
          >
            Search Campaigns{' '}
            <FiChevronRight
              className={`transition-all transform${
                showForm ? ' rotate-90' : ''
              }`}
            />
          </H2>
          <Link href="/admin/add-campaign">
            <Button color="success">Add a new campaign</Button>
          </Link>
        </div>
        <SearchForm show={showForm} />
        {campaigns && campaigns.length > 0 ? (
          <AdminCandidatesTable campaigns={campaigns} />
        ) : (
          <H4 className="text-center">
            {loading ? (
              <div>
                Loading <br />
                <CircularProgress size={20} />
              </div>
            ) : (
              <>
                {searchParamsAreEmpty ? (
                  <span>Please perform a search...</span>
                ) : (
                  <span>
                    Your search returned 0 records.
                    <br />
                    Please refine your search and try again.
                  </span>
                )}
              </>
            )}
          </H4>
        )}
      </PortalPanel>
    </AdminWrapper>
  )
}

export default CampaignStatisticsPage
