'use client'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { clientRequest } from 'gpApi/typed-request'

export const electedOfficeQueryOptions = queryOptions({
  queryKey: ['electedOffice'],
  queryFn: () =>
    clientRequest('GET /v1/elected-office/current', {}).then((res) => res.data),
})

export const useElectedOffice = () => useQuery(electedOfficeQueryOptions)
