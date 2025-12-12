import AcademyPage from './components/AcademyPage'
import pageMetaData from 'helpers/metadataHelper'

export const revalidate = 3600
export const dynamic = 'force-static'

const meta = pageMetaData({
  title: 'GoodParty.org Academy',
  description:
    "Explore the possibility of serving your community and running for office in our free, 3-session course, GoodParty.org Academy. We'll cover everything from evaluating a possible campaign, launching your candidacy, and running an efficient and effective operation. Taught by experts Rob Booth and Jared Alper, the Academy is open to all who want to make their community a better place and run a people-centered campaign.",
  slug: '/academy',
})
export const metadata = meta

export default async function Page(): Promise<React.JSX.Element> {
  return <AcademyPage />
}
