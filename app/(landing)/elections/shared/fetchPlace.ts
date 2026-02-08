import { electionApiRoutes } from 'gpApi/routes'
import unAuthElectionFetch from 'electionApi/unAuthElectionFetch'
import { Place, Race, PlaceChild } from './types'

interface FetchPlaceParams {
  slug: string
  includeRaces?: boolean
  includeParent?: boolean
  includeChildren?: boolean
  categorizeChildren?: boolean
  placeColumns?: string
}

export interface PlaceParent {
  name: string
  slug: string
  state: string
  geoId?: string
}

export interface PlaceResult {
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
  Races?: Race[]
  races?: Race[] | null
  children?: PlaceChild[] | null
  parent?: PlaceParent
  counties?: Place[]
  districts?: Place[]
  others?: Place[]
  categorizedChildren?: {
    counties?: Place[]
    districts?: Place[]
    others?: Place[]
  }
}

const fetchPlace = async ({
  slug,
  includeRaces = true,
  includeParent = false,
  includeChildren = true,
  categorizeChildren = false,
  placeColumns = ''
}: FetchPlaceParams): Promise<PlaceResult | null> => {
  const api = electionApiRoutes.places.find.path
  const payload = {
    slug: slug.toLowerCase(),
    includeChildren,
    includeRaces,
    raceColumns:
      'slug,normalizedPositionName,electionDate,positionDescription,positionLevel',
    includeParent,
    categorizeChildren,
    ...(placeColumns ? { placeColumns } : {})
  }

  const res = await unAuthElectionFetch(api, payload, 3600)
  if (Array.isArray(res)) {
    return res[0]
  }
  return null
}
export default fetchPlace
