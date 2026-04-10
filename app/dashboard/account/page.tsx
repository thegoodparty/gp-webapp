import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import pageMetaData from 'helpers/metadataHelper'
import AccountProfilePage from './components/AccountProfilePage'

const meta = pageMetaData({
  title: 'Profile',
  description: 'Manage your profile on GoodParty.org.',
})
export const metadata = meta

const Page = async (): Promise<React.JSX.Element> => {
  const { userId } = await auth()
  if (!userId) {
    redirect('/login')
  }

  return <AccountProfilePage />
}

export default Page
