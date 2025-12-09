import type { JsonObject } from 'helpers/jsonTypes'

// Prisma-derived enums and models used by the Website/Domain features

export type WebsiteStatus = 'published' | 'unpublished'

export interface DomainModel {
  id?: number
  name?: string
  status?: 'pending' | 'submitted' | 'registered' | 'active' | 'inactive'
  operationId?: string | null
  price?: number | string | null
}

export interface WebsiteModel {
  id?: number
  campaignId?: number
  status?: WebsiteStatus
  vanityPath?: string
  content?: JsonObject | null
  domain?: DomainModel | null
}

export interface WebsiteContact {
  id?: number
  createdAt?: string
  updatedAt?: string
  websiteId?: number
  name?: string
  email?: string
  phone?: string | null
  message?: string
  smsConsent?: boolean
}

export interface WebsiteContactsResponse {
  contacts: WebsiteContact[]
  totalPages: number
}

export interface DomainSearchSuggestion {
  DomainName: string
  price?: number | string | null
}

export interface DomainSearchResponse {
  domainName: string
  price?: number | string | null
  availability: 'AVAILABLE' | 'UNAVAILABLE' | string
  suggestions: DomainSearchSuggestion[]
}
