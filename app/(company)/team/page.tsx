import React from 'react'
import pageMetaData from 'helpers/metadataHelper'
import TeamPage from './components/TeamsPage'
import { fetchContentByType } from 'helpers/fetchHelper'

export const revalidate = 3600
export const dynamic = 'force-static'

interface PhotoData {
  url: string
  alt?: string
}

interface TeamMember {
  id: string
  fullName: string
  role: string
  partyRole?: string
  goodPhoto?: PhotoData
  partyPhoto?: PhotoData
}

const meta = pageMetaData({
  title: 'Team | GoodParty.org',
  description:
    "GoodParty.org's core team are the people working full-time, part-time, or as dedicated volunteer contributors on our mission of making people matter more than money in our democracy.",
  slug: '/team',
})
export const metadata = meta

const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  return await fetchContentByType<TeamMember[]>('goodPartyTeamMembers')
}

const Page = async (): Promise<React.JSX.Element> => {
  const childProps = {
    teamMembers: await fetchTeamMembers(),
  }
  return <TeamPage {...childProps} />
}

export default Page
