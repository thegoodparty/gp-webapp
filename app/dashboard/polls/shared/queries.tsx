import { queryOptions } from '@tanstack/react-query'
import { clientRequest } from 'gpApi/typed-request'

export type ContactStatsBucket = {
  label: string
  count: number
  percent: number
}
export type ContactStatsCategory = ContactStatsBucket[]

export type ContactsStats = {
  districtId: string
  computedAt: string
  totalConstituents: number
  totalConstituentsWithCellPhone: number
  buckets: {
    age: ContactStatsCategory
    homeowner: ContactStatsCategory
    education: ContactStatsCategory
    presenceOfChildren: ContactStatsCategory
    estimatedIncomeRange: ContactStatsCategory
  }
}

export const districtStatsQueryOptions = queryOptions({
  queryKey: ['contacts-stats'],
  queryFn: () =>
    clientRequest('GET /v1/contacts/stats', {}).then((res) => res.data),
})
