export interface Race {
  id: number | string
  slug: string
  normalizedPositionName?: string
  electionDate?: string
  positionDescription?: string
  positionLevel?: string
}

export interface Article {
  id: number | string
  title: string
  slug: string
  summary?: string
  mainImage?: string
}

export interface City {
  slug: string
  name: string
}

export interface County {
  name?: string
  slug: string
  state: string
  geoId?: string
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

export interface Place {
  slug: string
  name?: string
}
