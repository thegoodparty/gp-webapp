import pageMetaData from 'helpers/metadataHelper'
import ElectionsPage from './components/ElectionsPage'

export const revalidate = 3600
export const dynamic = 'force-static'

const meta = pageMetaData({
  title: 'Election Research',
  description:
    ': Learn about elected offices to run for in your community and how to get on the ballot! A free resource for real people to find new ways to serve their community.',

  slug: '/elections',
  image: 'https://assets.goodparty.org/elections.png',
})
export const metadata = meta

export default async function Page(): Promise<React.JSX.Element> {
  return <ElectionsPage />
}
