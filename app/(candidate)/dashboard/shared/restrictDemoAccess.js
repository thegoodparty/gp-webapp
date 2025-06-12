import { getServerUser } from 'helpers/userServerHelper'
import { redirect } from 'next/navigation'

export const restrictDemoAccess = async () => {
  const user = await getServerUser()
  const { metaData } = user || {}
  const { demoPersona } = metaData || {}

  if (demoPersona) {
    redirect('/dashboard')
  }
}
