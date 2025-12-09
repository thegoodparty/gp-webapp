import pageMetaData from 'helpers/metadataHelper'
import LogoutPage from './components/LogoutPage'

const meta = pageMetaData({
  title: 'Log out',
  description: 'Log out',
  slug: '/logout',
})
export const metadata = meta

export default async function Page(): Promise<React.JSX.Element> {
  return <LogoutPage />
}
