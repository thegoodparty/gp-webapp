import pageMetaData from 'helpers/metadataHelper'
import AboutPage from './components/AboutPage'

export const revalidate = 3600
export const dynamic = 'force-static'

const meta = pageMetaData({
  title: 'Our Mission | GoodParty.org',
  description:
    "Learn why we're building the movement and tools to end the US's two-party political dysfunction and create a truly representative democracy.",
  slug: '/about',
})

export const metadata = meta

export default async function Page(): Promise<React.JSX.Element> {
  return <AboutPage />
}
