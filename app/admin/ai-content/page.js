import { adminAccessOnly } from 'helpers/permissionHelper'
import AiContentPage from './components/AiContentPage'
import pageMetaData from 'helpers/metadataHelper'

const meta = pageMetaData({
  title: 'AI Content | GoodParty.org',
  description: 'AI Content.',
  slug: '/admin/ai-content',
})
export const metadata = meta
export const maxDuration = 60

export default async function Page() {
  await adminAccessOnly()

  const childProps = {
    pathname: '/admin/ai-content',
    title: 'AI Content',
  }
  return <AiContentPage {...childProps} />
}
