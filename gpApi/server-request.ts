import { API_ROOT } from 'appEnv'
import axios from 'axios'
import { createRequest } from './typed-request'
import { getServerToken } from 'helpers/userServerHelper'

/** Use this for server-side requests. */
const client = axios.create({ baseURL: API_ROOT })
client.interceptors.request.use(async (config) => {
  const token = await getServerToken()
  config.headers.Authorization = `Bearer ${token}`
  return config
})

export const serverRequest = createRequest(client)
