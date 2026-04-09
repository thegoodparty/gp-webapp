import { serverRequest } from 'gpApi/server-request'

export const listBriefings = () =>
  serverRequest(
    'GET /v1/meetings/briefings',
    {},
    { ignoreResponseError: true },
  ).then((res) => res.data)

export const getBriefing = (date: string) =>
  serverRequest(
    'GET /v1/meetings/briefings/:date',
    { date },
    { ignoreResponseError: true },
  ).then((res) => res.data)
