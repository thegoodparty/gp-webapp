'use client'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import PortalPanel from '@shared/layouts/PortalPanel'
import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import { useState } from 'react'
import { useSnackbar } from 'helpers/useSnackbar'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

interface P2VStats {
  total?: number
  auto?: number
  manual?: number
  pending?: number
}

interface P2VStatsPageProps {
  pathname: string
  title: string
}

export default function P2VStatsPage(
  props: P2VStatsPageProps,
): React.JSX.Element {
  const [processing, setProcessing] = useState(false)
  const [p2vStats, setP2vStats] = useState<P2VStats>({})
  const { successSnackbar, errorSnackbar } = useSnackbar()

  const getP2VStats = async () => {
    try {
      const resp = await clientFetch<P2VStats>(apiRoutes.admin.campaign.p2vStats)
      const statsResponse = resp.data

      if (statsResponse) {
        setP2vStats(statsResponse)
      }
      return true
    } catch (e) {
      console.log('error at p2vStats', e)
      return false
    }
  }

  const handleP2VStats = async () => {
    successSnackbar('Refreshing stats')

    if (processing) return
    setProcessing(true)
    const res = await getP2VStats()
    if (res) {
      successSnackbar('Completed')
      setProcessing(false)
    } else {
      errorSnackbar('Error refreshing stats. Please try again later.')
    }
  }
  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <H1>P2V Stats</H1>
        <div className="mt-12">
          <div className="mb-6 pb-6 border-b border-gray-600">
            <Body1 className="mb-6">
              <table className="table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Total</th>
                    <th className="px-4 py-2">Automated</th>
                    <th className="px-4 py-2">Manual</th>
                    <th className="px-4 py-2">Pending</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-gray-100">
                    <td className="border px-4 py-2">{p2vStats?.total}</td>
                    <td className="border px-4 py-2">{p2vStats?.auto}</td>
                    <td className="border px-4 py-2">{p2vStats?.manual}</td>
                    <td className="border px-4 py-2">{p2vStats?.pending}</td>
                  </tr>
                </tbody>
              </table>
            </Body1>
            <div onClick={handleP2VStats}>
              <PrimaryButton disabled={processing}>
                Refresh P2V Stats
              </PrimaryButton>
            </div>
          </div>
        </div>
      </PortalPanel>
    </AdminWrapper>
  )
}
