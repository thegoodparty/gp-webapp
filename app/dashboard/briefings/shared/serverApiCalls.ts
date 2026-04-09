import { serverRequest } from 'gpApi/server-request'

export const listBriefings = () =>
  serverRequest('GET /v1/meetings/briefings', {}).then((res) => res.data)

export const getBriefing = (date: string) =>
  serverRequest('GET /v1/meetings/briefings/:date', { date }).then(
    (res) => res.data,
  )
