import { queryOptions } from '@tanstack/react-query'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export type ContactStatsBucket = {
  label: string
  count: number
  percent: number
}
export type ContactStatsCategory = { buckets: ContactStatsBucket[] }

export type ContactsStats = {
  meta: { totalConstituents: number }
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
      clientFetch<ContactsStats>(apiRoutes.contacts.stats, params).then(
        (res) => res.data,
      ),
  })
