export interface Race {
  id: number | string
  slug: string
  name?: string
  state?: string
  normalizedPositionName?: string
  electionDate?: string
  positionDescription?: string
  positionLevel?: string
  frequency?: string[]
  filingDateStart?: string
  filingDateEnd?: string
  employmentType?: string
  salary?: string
  eligibilityRequirements?: string
  filingOfficeAddress?: string
  filingPhoneNumber?: string
  paperworkInstructions?: string
  filingRequirements?: string
  isRunoff?: boolean
  isPrimary?: boolean
  partisanType?: string
  positionNames?: string[]
  Place?: Place
  loc?: string
}

interface ImageData {
  url?: string
  alt?: string
}

export interface Article {
  id?: string
  title: string
  slug: string
  summary?: string
  mainImage?: ImageData
  publishDate: string
  contentId?: string
}

export interface City {
  slug: string
  name: string
  population?: number
  density?: number
  incomeHouseholdMedian?: number
  unemploymentRate?: number
  homeValue?: number
  county_name?: string
}

export interface County {
  name?: string
  slug: string
  state: string
  geoId?: string
  cityLargest?: string
  population?: number
  density?: number
  incomeHouseholdMedian?: number
  unemploymentRate?: number
  homeValue?: number
}

export interface Municipality {
  name: string
  slug: string
  type?: string
  state: string
}

export interface Parent {
  name: string
  slug: string
  state: string
  geoId?: string
}

export interface PlaceChild {
  id: number | string
  name: string
  slug?: string
}

export interface Place {
  slug: string
  name?: string
  geoId?: string
  state?: string
  cityLargest?: string
  countyName?: string
  population?: number
  density?: number
  incomeHouseholdMedian?: number
  unemploymentRate?: number
  homeValue?: number
  parent?: Parent
  children?: PlaceChild[]
}
