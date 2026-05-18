import pageMetaData from 'helpers/metadataHelper'
import { getBriefingsList } from '@shared/briefings/server'
import { serverRequest } from 'gpApi/server-request'
import { IS_DEV, IS_LOCAL } from 'appEnv'
import serveAccess from '../shared/serveAccess'
import DashboardLayout from '../shared/DashboardLayout'
import BriefingsLanding from './components/BriefingsLanding'

const meta = pageMetaData({
  title: 'Briefings | GoodParty.org',
  description: 'Meeting briefings',
  slug: '/dashboard/briefings',
})
export const metadata = meta
export const dynamic = 'force-dynamic'

const loadElectedOfficeId = async (): Promise<string | null> => {
  if (!IS_LOCAL && !IS_DEV) return null
  try {
    const { data } = await serverRequest('GET /v1/elected-office/current', {})
    return data.id ?? null
  } catch {
    return null
  }
}

export default async function Page(): Promise<React.JSX.Element> {
  await serveAccess()

  const [summaries, devElectedOfficeId] = await Promise.all([
    getBriefingsList(),
    loadElectedOfficeId(),
  ])
  return (
    <DashboardLayout pathname="/dashboard/briefings" showAlert={false}>
      <BriefingsLanding
        summaries={summaries}
        devElectedOfficeId={devElectedOfficeId}
      />
    </DashboardLayout>
  )
}
