import { queryOptions } from '@tanstack/react-query'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

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
    clientFetch<ContactsStats>(apiRoutes.contacts.stats).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch contacts stats')
      }

      return res.data
    }),
})
