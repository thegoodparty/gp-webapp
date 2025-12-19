'use client'

import PortalPanel from '@shared/layouts/PortalPanel'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import { useEffect, useMemo, useState } from 'react'
import Table from '@shared/utils/Table'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

interface CampaignData {
  aiContent?: Partial<Record<string, string | object>>
}

interface Campaign {
  data: CampaignData
}

interface ContentRow {
  contentType: string
  count: number
}

interface AiContentPageProps {
  pathname: string
  title: string
}

export const fetchCampaigns = async (): Promise<Campaign[]> => {
  const resp = await clientFetch<Campaign[]>(apiRoutes.campaign.list)
  return resp.data
}

export default function AiContentsPage(
  props: AiContentPageProps,
): React.JSX.Element {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  useEffect(() => {
    const fetchData = async () => {
      const fetchedCampaigns = await fetchCampaigns()
      setCampaigns(fetchedCampaigns)
    }
    fetchData()
  }, [])

  const inputData: ContentRow[] = []
  const contentCount: Partial<Record<string, number>> = {}
  if (campaigns) {
    campaigns.map((campaignObj) => {
      const { data } = campaignObj
      const { aiContent } = data
      if (aiContent) {
        Object.keys(aiContent).forEach((key) => {
          const keyNoDigits = key.replace(/\d+$/, '')

          if (!contentCount[keyNoDigits]) {
            contentCount[keyNoDigits] = 0
          }
          contentCount[keyNoDigits] = (contentCount[keyNoDigits] || 0) + 1
        })
      }
    })
  }
  Object.keys(contentCount).forEach((key) => {
    inputData.push({
      contentType: key,
      count: contentCount[key] || 0,
    })
  })
  const data = useMemo(() => inputData, [inputData])

  const columns = useMemo(
    () => [
      {
        id: 'contentType',
        header: 'Content Type',
        accessorKey: 'contentType',
      },
      {
        id: 'count',
        header: 'Count',
        accessorKey: 'count',
      },
    ],
    [],
  )

  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <Table columns={columns} data={data} />
      </PortalPanel>
    </AdminWrapper>
  )
}
