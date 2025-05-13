'use client'

import PortalPanel from '@shared/layouts/PortalPanel'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import { useEffect, useMemo, useState } from 'react'
import Table from '@shared/utils/Table'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export const fetchCampaigns = async () => {
  const resp = clientFetch(apiRoutes.campaign.list)
  return resp.data
}

export default function AiContentsPage(props) {
  const [campaigns, setCampaigns] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const campaigns = await fetchCampaigns()
      setCampaigns(campaigns)
    }
    fetchData()
  }, [])

  const inputData = []
  const contentCount = {}
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
          contentCount[keyNoDigits]++
        })
      }
    })
  }
  Object.keys(contentCount).forEach((key) => {
    inputData.push({
      contentType: key,
      count: contentCount[key],
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
