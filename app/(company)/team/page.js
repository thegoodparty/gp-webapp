import React from 'react'
import pageMetaData from 'helpers/metadataHelper'
import TeamPage from './components/TeamsPage'
import { fetchContentByType } from 'helpers/fetchHelper'

export const revalidate = 3600
export const dynamic = 'force-static'

const meta = pageMetaData({
  title: 'Team | GoodParty.org',
  description:
    "GoodParty.org's core team are the people working full-time, part-time, or as dedicated volunteer contributors on our mission of making people matter more than money in our democracy.",
  slug: '/team',
})
export const metadata = meta

async function fetchTeamMembers() {
  return await fetchContentByType('goodPartyTeamMembers')
}

const Page = async () => {
  const childProps = {
    teamMembers: await fetchTeamMembers(),
  }
  return <TeamPage {...childProps} />
}

export default Page
