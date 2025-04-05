import { getServerUser } from 'helpers/userServerHelper'
import { redirect } from 'next/navigation'
import SetNamePage from './components/SetNamePage'
import pageMetaData from 'helpers/metadataHelper'

const meta = pageMetaData({
  title: 'Set Name',
  description: 'Set Name',
  slug: '/set-name',
})
export const metadata = meta

export default async function Page() {
  const user = await getServerUser()
  if (!user) {
    redirect('/login')
  }
  return <SetNamePage />
}
