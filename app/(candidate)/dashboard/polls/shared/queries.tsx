import { queryOptions } from '@tanstack/react-query'
import { request } from 'gpApi/typed-request'

export type ContactStatsBucket = {
  label: string
  count: number
  percent: number
}
export type ContactStatsCategory = { buckets: ContactStatsBucket[] }

export type ContactsStats = {
  meta?: { totalConstituents: number }
  categories?: {
    age?: ContactStatsCategory
    homeowner?: ContactStatsCategory
    presenceOfChildren?: ContactStatsCategory
    estimatedIncomeRange?: ContactStatsCategory
    education?: ContactStatsCategory
  }
}

export const districtStatsQueryOptions = (params?: {
  hasCellPhone?: 'true' | undefined
}) =>
  queryOptions({
    queryKey: ['contacts-stats', params],
    queryFn: () =>
      request('GET /v1/contacts/stats', params ?? {}).then((res) => res.data),
  })
