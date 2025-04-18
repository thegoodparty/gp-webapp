import pageMetaData from 'helpers/metadataHelper'
import TasksPage from './components/TasksPage'
import { adminAccessOnly } from 'helpers/permissionHelper'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'

const fetchCampaign = async () => {
  const resp = await serverFetch(apiRoutes.campaign.get)
  return resp.data
}

const fetchTasks = async () => {
  const currentDate = new Date().toISOString().split('T')[0]

  const resp = await serverFetch(apiRoutes.campaign.tasks.list, {
    date: currentDate,
  })
  return resp.data
}

const meta = pageMetaData({
  // TODO update when this replaces dashboard home
  title: 'Campaign Tasks | GoodParty.org',
  description: 'Campaign Tasks',
  slug: '/dashboard/tasks',
})
export const metadata = meta

export default async function Page() {
  /* TODO: remove admin access once feature is released */
  await adminAccessOnly()

  const campaign = await fetchCampaign()
  const tasks = await fetchTasks()

  return (
    <TasksPage pathname="/dashboard/tasks" campaign={campaign} tasks={tasks} />
  )
}
