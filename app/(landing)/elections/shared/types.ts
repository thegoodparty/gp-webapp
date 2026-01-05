export interface Race {
  id: number | string
  slug: string
  normalizedPositionName?: string
  electionDate?: string
  positionDescription?: string
  positionLevel?: string
}

interface ImageData {
  url: string
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
