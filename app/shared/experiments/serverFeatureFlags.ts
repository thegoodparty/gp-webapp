import { Experiment } from '@amplitude/experiment-node-server'
import { cookies } from 'next/headers'
import { getServerUser } from 'helpers/userServerHelper'
import { IS_LOCAL } from 'appEnv'

let client: ReturnType<typeof Experiment.initializeRemote> | null = null

const getClient = () => {
  if (client) {
    return client
  }

  if (!process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY) {
    if (IS_LOCAL) {
      console.error(
        'NEXT_PUBLIC_AMPLITUDE_API_KEY is not set, server-side feature flags will be evaluated to false',
      )
      return undefined
    }
    throw new Error('NEXT_PUBLIC_AMPLITUDE_API_KEY is not set')
  }
  client = Experiment.initializeRemote(
    process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY,
  )
  return client
}

interface ServerUserContext {
  user_id?: string
  device_id?: string
  user_properties?: Record<string, string | number | boolean>
}

const buildUserContext = async (): Promise<ServerUserContext> => {
  const context: ServerUserContext = {}

  const [user, nextCookies] = await Promise.all([getServerUser(), cookies()])
  if (user) {
    context.user_id = String(user.id)
    const props: Record<string, string | number | boolean> = {}
    if (user.email) props.email = user.email
    if (user.name) props.name = user.name
    if (user.phone) props.phone = user.phone
    if (user.zip) props.zip = user.zip
    context.user_properties = props
  }

  const anonId = nextCookies.get('ajs_anonymous_id')?.value
  if (anonId) {
    try {
      context.device_id = decodeURIComponent(anonId).replace(/^"|"$/g, '')
    } catch {
      context.device_id = anonId
    }
  }

  return context
}

export type ServerFlags = Record<string, string | undefined>

export const getServerFlags = async (): Promise<ServerFlags> => {
  const experimentClient = getClient()

  if (!experimentClient) {
    return {}
  }

  const userContext = await buildUserContext()
  const variants = await experimentClient.fetchV2(userContext)

  return Object.fromEntries(
    Object.entries(variants).map(([k, v]) => [k, v?.value]),
  )
}
