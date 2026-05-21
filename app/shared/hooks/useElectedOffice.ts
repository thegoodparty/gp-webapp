'use client'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { clientRequest } from 'gpApi/typed-request'
import { FetchError } from 'ofetch'

export const electedOfficeQueryOptions = queryOptions({
  queryKey: ['electedOffice'],
  queryFn: async () => {
    try {
      const res = await clientRequest('GET /v1/elected-office/current', {})
      return res.data
    } catch (e) {
      if (e instanceof FetchError && e.status === 404) return null
      throw e
    }
  },
})

export const useElectedOffice = () => useQuery(electedOfficeQueryOptions)
