import pageMetaData from 'helpers/metadataHelper'
import ProUpgradeEntry from './components/ProUpgradeEntry'

const meta = pageMetaData({
  title: 'Upgrade to Pro | GoodParty.org',
  description: 'Upgrade to GoodParty.org Pro',
  slug: '/dashboard/pro-upgrade',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default function Page(): React.JSX.Element {
  return <ProUpgradeEntry />
}
